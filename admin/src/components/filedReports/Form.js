import React, {useState, useEffect} from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { getApp } from 'firebase/app';
import {getDownloadURL, ref, uploadBytesResumable, getStorage} from 'firebase/storage';
import app from '../../firebase/firebase';

export default function Form({report, getContent}) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const firebaseApp = getApp();
  const today = new Date();
  const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  const fileName =today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
  const storage = getStorage(firebaseApp, "gs://admin-incident-report-dev.appspot.com");

  const onEditorStateChange = (editor) => {
    setEditorState(editor)
 }
 
  useEffect(() => {
    getContent(convertToRaw(editorState.getCurrentContent()));
    
  }, [editorState]);

  function uploadImageCallBack(file) {
    if (!file) return;
 
    console.log(file.name);
    
    return new Promise(
      (resolve, reject) => {
        const storageRef = ref(storage, `/incident-report/admin/${date}/${file.name}`)
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
     editorState={editorState}
     toolbarClassName="toolbarClassName"
     wrapperClassName="wrapperClassName"
     editorClassName="editorClassName"
     onEditorStateChange={onEditorStateChange}
     placeholder='Start writing your Evaluation...'
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
