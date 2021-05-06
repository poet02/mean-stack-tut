import { AbstractControl } from "@angular/forms";
import { Observer, Observable, of } from "rxjs";


//{} blank is sync call
// after : is return type
//[ with key means: dynamic prop name
export const mimeType = (
  control: AbstractControl
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  //async validator
  if (typeof(control.value) === 'string' ) {
    return of(null);
  }
  if (!control.value) {
    console.log(control)
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();

  const frObs = Observable.create((observer: Observer<{ [key: string]: any }> ) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4); //get mime type

      let header = "";
      let isValid = false;
      for (let i =0; i < arr.length; i++) {
        header += arr[i].toString(16);//convert to hexadecimal
      }
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }

      if (isValid) {
        observer.next(null);
      } else {
        observer.next({invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);//mime type read
  });

  return frObs;
};
