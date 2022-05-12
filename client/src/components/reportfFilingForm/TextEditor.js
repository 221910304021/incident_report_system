import { EditorState, convertToRaw } from 'draft-js';
import React, { useState, useEffect, useRef } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { getApp } from 'firebase/app';
import {getDownloadURL, ref, uploadBytesResumable, getStorage} from 'firebase/storage';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useAuth } from '../../contexts/AuthContext';

export default function TextEditor({getContent, focus, holder}) {
  const {currentUser} = useAuth();
  const editorRef = useRef();
  const firebaseApp = getApp();
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const fileName =today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  const storage = getStorage(firebaseApp, "gs://ojt-incident-report-system-dev.appspot.com");

  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorStateChange = (editor) => {
      setEditorState(editor)
  }

  useEffect(() => {
    getContent(convertToRaw(editorState.getCurrentContent()));
    if(focus){
      editorRef.current.focusEditor();
    }
  }, [editorState]);


  function uploadImageCallBack(file) {
    if (!file) return;
 
    console.log(file.name);
    
    return new Promise(
      (resolve, reject) => {
        const storageRef = ref(storage, `/incident-report/${currentUser.uid}/${date}/${file.name}`)
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', 
          (snapshot) => {},
          (err) => { reject(err); },
          () => { getDownloadURL(uploadTask.snapshot.ref)
            .then((url) => {
              resolve({data: {link: url}})}) }
        )
      }
    );


  }

  return (
    <>
        <Editor
          placeholder={holder}
          editorState={editorState}
          ref={editorRef}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onEditorStateChange={onEditorStateChange}
          toolbar={{
            options: [ 'history', 'inline', 'blockType', 'list', 'textAlign', 'colorPicker', 'emoji', 'image', 'remove'],
            inline: { inDropdown: true },
            list: { inDropdown: true },
            textAlign: { inDropdown: true },
            link: { inDropdown: true },
            image: { uploadCallback: uploadImageCallBack, previewImage: true,
              defaultSize: {
                height: 'auto',
                width: '75%',
              },
            },
          }}
        />
    </>
    
  )
}
