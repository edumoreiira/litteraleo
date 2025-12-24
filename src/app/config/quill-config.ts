import Quill from 'quill';
import BlotFormatter from '@enzedonline/quill-blot-formatter2';

// register the module with quill before exporting the config
// formatting functionality relies on this registration
Quill.register('modules/blotFormatter2', BlotFormatter);

export const EDITOR_MODULES = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'background': [] }, { 'color': [] }],
    [{ 'align': [] }, { 'header': [1, 2, 3, false] }],
    ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
  // blotformatter2 configuration
  blotFormatter2: {
    resize: {
      allowResizing: true,
      useRelativeSize: true, // uses % instead of px
      allowResizeModeChange: true, // allows switching between % and px
    },
    align: {
      allowAligning: true,
    },
    image: {
      allowAltTitleEdit: true,
      registerImageTitleBlot: true,
      allowCompressor: true,
      compressorOptions: {
        jpegQuality: 0.9, 
        maxWidth: 1000
      }
    },
  }
};


// export const  EDITOR_MODULES = {
//     toolbar: [
//       ['bold', 'italic', 'underline'],
//       [{ 'background': [] }, { 'color': [] }],
//       [{ 'align': [] }, { 'header': [1, 2, 3, false] }],
//       ['blockquote', { 'list': 'ordered' }, { 'list': 'bullet' }],
//       ['link', 'image'],
//       ['clean'], // remove formatting
//     ]
//   };