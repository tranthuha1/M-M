import { useApi } from '@/store/useApi';
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const api = useApi();
const toast = useToast();
export interface Params {
  file: File;
  type: number;
}

/* eslint-disable */
export default class UploadFile {
   loader: any;
   constructor( loader : any ) {
    this.loader = loader;
     console.log('loader ', loader);

   }
  upload() {
    return this.loader.file
      .then( (file : any) => new Promise( ( resolve, reject ) => {
        this._initRequest(resolve, file, reject );
        // this._initListeners( resolve, reject, file );
        // this._sendRequest( file );
      } ) );
  }
  abort() {
    // @ts-ignore
    if ( this.xhr ) {
      // @ts-ignore
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  async  _initRequest(resolve : any ,file : any, reject : any) {
    // @ts-ignore
    console.log('_initRequest ', file.size);

    const params1 = ref<Params>({
      file: file,
      type: 1,
    });
    const type = file.name.split('.').pop().toString().toLowerCase();
    console.log(type);
    if (!(type === 'jpg' || type === 'jpeg' || type === 'png')) {
      toast.error('File không đúng định dạng, vui lòng chọn lại');
      this._initListeners( resolve, reject, file );
    } else if (file.size > 5000000) {
      toast.error('File vượt quá 5MB, vui lòng chọn lại');
       this._initListeners( resolve, reject, file );
    } else {
      console.log('post ', file);
      try {
        const res = await api.post('/cms/portal/v1/upload/image_upload', {
          ...params1.value
        }, {headers: {'content-type': 'multipart/form-data', 'AppId': process.env.VUE_APP_BASE_APP_ID}});

        console.log(' post success', res.data.data.url_path);
        if( res.data.status === 0) {
          resolve({
            default: res.data.data.url_path
          });
        }else{
          toast.error( res.data.data.message);
          this._initListeners( resolve, reject, file );
        }
      } catch (err: any) {
        console.error(err);
      }
    }

  }

  // Initializes XMLHttpRequest listeners.
  _initListeners( resolve : any, reject : any, file : File ) {
    // @ts-ignore
    const xhr = this.xhr;
    // @ts-ignore
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${ file.name }.`;

    // xhr.addEventListener( 'error', () => reject( genericErrorText ) );
    // @ts-ignore
    reject();
    // xhr.addEventListener( 'abort', () => reject() );
    // xhr.addEventListener( 'load', () => {
      //  const response = {url:'sdfsdfs'};


    // } );
    //
    // if ( xhr.upload ) {
    //   // @ts-ignore
    //   xhr.upload.addEventListener( 'progress', evt => {
    //     if ( evt.lengthComputable ) {
    //       loader.uploadTotal = evt.total;
    //       loader.uploaded = evt.loaded;
    //     }
    //   } );
    // }
  }

  // Prepares the data and sends the request.
   _sendRequest( file: string | Blob ) {
    // Prepare the form data.
    const data = new FormData();
    // @ts-ignore
    data.append('type', 1)
    data.append('file', file)


    // Send the request.
    //  this.xhr.send( data );
  }
}
