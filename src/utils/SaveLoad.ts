export const saveFile = (filename: string, text: string) => {
    const blob = document.createElement("a");
    blob.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    blob.setAttribute("download", filename);
  
    if (document.createEvent) {
        const event = document.createEvent("MouseEvents");
        event.initEvent("click", true, true);
        blob.dispatchEvent(event);
    } else {
        blob.click();
    }
};

export const loadFile = (e: Event, cb: (text: string) => void) => {
    return () => {
        const files = (<HTMLInputElement>e.target).files as FileList
        if (!files) {
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e: ProgressEvent<FileReader>) {
            const contents = e.target!.result;
            cb(contents as string);
        };
        reader.readAsText(files[0]);
    };
  };