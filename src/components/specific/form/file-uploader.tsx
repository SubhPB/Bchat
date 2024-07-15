// Byimaan
'use client';
import React, { useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { _console } from '@/utils/console';
import Image from 'next/image';
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast';
import { FileValidator } from '@/utils/validators/filetype';

type Props = {
    whatToUploadTitle ?: string,
    fileType ?: string,
    maxFileSizeInMb ?: number,
    maxNoOfFiles ?: number
    multiple ?: boolean
}

function FileInput({
    whatToUploadTitle='Drag and drop your files here',
    fileType= 'image/*',
    maxNoOfFiles= 1,
    multiple= false,
    maxFileSizeInMb=Infinity,
}: Props)
{
    
    
    if (maxNoOfFiles > 1){
        multiple = true
    }
    
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    
    
    const fileInspector = new FileValidator({
        expectedSizeInBytes: maxFileSizeInMb * (1024**2),
        expectedType: fileType
    });
    const setAndFilterFiles = (files: File[]) => {

        if (files.length > maxNoOfFiles){
            toast.error(`You can't select more than ${maxNoOfFiles} files.`, {
                position: 'bottom-right',
            });
            return;
        }

        const _filteredFiles = files.filter(
            file => {
                try {
                    fileInspector.compareOrThrow(file);
                    return true
                } catch (error) {
                    if (error instanceof Error) {
                        toast.error(error.message, {
                            position: 'bottom-right'
                    });
                    return false
                }
            }
        });

        _console._log.doGreen(`_filtered files`, _filteredFiles)
        if (_filteredFiles.length > 0){
            setFiles(_filteredFiles)
        }
    }
 
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const allFiles = e?.target?.files
        if (allFiles){
            
            _console._log.doGreen(allFiles);

            // setFiles(
            //     () => Array.from(allFiles)
            // )

            setAndFilterFiles(Array.from(allFiles))

            
            // const formData = new FormData();
            // formData.append('file', e.target.files[0]);
        }
        dragActive && setDragActive(false);
    };

    // button
    const onButtonClick = () => {
        const ref = inputRef.current;
        if (ref){
            ref.click();
            setDragActive(true);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files){
            // setFiles(
            //     () => Array.from(e.dataTransfer.files)
            // )
            setAndFilterFiles(Array.from(e.dataTransfer.files))
        };
        setDragActive(false)
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }

    const handleFileDelete = (file: File) => {
        files && setFiles(
            allFiles => allFiles?.filter(
                    _file => _file !== file
            )
        )
    };

    // if (files.length > 0){
    //     const formData = new FormData();
    //     files.forEach(
    //         (file, index) => formData.append(`file-${index}`, file)
    //     );
    //     formData.forEach(file => console.log('TTT ', file))
    // }

    return (
        <div className='w-full my-2 text-center relative '>
            <Input ref={inputRef} className='hidden' multiple={multiple} type={'file'} accept={fileType}  onChange={handleFileChange}/>
            <label htmlFor="input-file-upload" className={'relatve w-full flex flex-col items-center justify-center border-2 rounded-2xl border-dashed border-black bg-gray-100 '}>
                <div className='relative w-full my-4 aspect-w-1 aspect-h-[0.7] ' onDragEnter={() => !dragActive && setDragActive(true)} >

                    <div className='size-full grid place-content-center'>

                        <p> {whatToUploadTitle} </p>
                        <button type='button' className='upload-button cursor-pointer p-1 text-lg border-none bg-transparent hover:underline' onClick={onButtonClick}>Upload a file</button>
                    </div>
                    {
                        dragActive && (
                            <div className="absolute size-full top-0 right-0 bottom-0 left-0 bg-slate-200 opacity-55" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
                            </div>
                        )
                    }
                </div>
                {
                    files.length > 0 && (
                        <div className='w-full p-2'>
                            <p className='w-full h-[1px] bg-zinc-700'/>
                            {
                                files.map(
                                    (file, index) => {
                                        const imgSrc = URL.createObjectURL(file)
                                        return (
                                            <div key={index} className="flex flex-col my-1 gap-1 relative w-full aspect-w-[0.6] aspect-h-[0.4]">
                                                <Image src={imgSrc} className='w-full h-full object-contain object-center' width={800} height={900} alt='selected-img'/>
                                                <div className="absolute left-[90%] rounded-full size-fit p-2 text-sm bg-red-600 cursor-pointer" onClick={() => handleFileDelete(file)}>
                                                    <RxCross2 className='text-white font-bold' />
                                                </div>
                                            </div>
                                        )
                                    }
                                )
                            }
                        </div>
                    )
                }
            </label>
        </div>
    )
};




export default FileInput