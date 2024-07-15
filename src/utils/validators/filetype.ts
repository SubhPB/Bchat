// Byimaan

import { _console } from "../console";

class Type {
    constructor(public type: string){
        this.type = type
    };

    compare(argType: string){
        return this.type === argType.split('/')[0]
    }
};

class Format {
    constructor(public format: string){
        this.format = format
    };

    compare(argFormat: string){

        if (this.format === '*'){
            return true
        }

        const splitedArg = argFormat.split('/');
        const arg = splitedArg.length > 0 ? splitedArg[1] : splitedArg[0]
        return this.format === arg;
    }
}

class FileTypeValidator {
    type: Type;
    format: Format;
    constructor(fileType: string){
        const list = fileType.split('/');
        this.type = new Type(list[0]);
        this.format = new Format(list[1])
    };

    validateOrThrow(fileType: string){
    
        if (!this.type.compare(fileType)){
            _console._log.doRed(`The file was expected to be of type ${this.type.type} and not of ${fileType.split('/')[0]}.`)
            throw new Error(`The file was expected to be of type ${this.type.type} and not of ${fileType.split('/')[0]}.`)
        };

        if (!this.format.compare(fileType)){
            _console._log.doRed(`Invalid file format. The file is expected only to be in ${this.format.format} format.`)
            throw new Error(`Invalid file format. The file is expected only to be in ${this.format.format} format.`)
        }
        return true
    }
};

class FileSize {
    public mbSize
    constructor(public sizeInBytes: number){
        this.sizeInBytes = sizeInBytes
        this.mbSize = sizeInBytes / (1024**2)
    };

    compareSizeInMB(bytesToCompare: number){
        const fileSize = new FileSize(bytesToCompare);
        return this.mbSize >= fileSize.mbSize;
    };

    compareSizeInMBOrThrow(bytesToCompare: number){
        
        if (!this.compareSizeInMB(bytesToCompare)){
            _console._log.doRed(`The given file is bit large. File Size exceeds than ${this.mbSize}Mb`)
            throw new Error(`The given file is bit large. File Size exceeds than ${this.mbSize}Mb`)
        }
        return true;
    }
};

type Args = {
    expectedType: string;
    expectedSizeInBytes: number,
    fileToValidate ?: File | null
}

class FileValidator {
    private fileTypeValidator : FileTypeValidator;
    private fileSize: FileSize;
    private file: File | null
    constructor({expectedType, expectedSizeInBytes, fileToValidate=null}: Args){
        this.fileTypeValidator = new FileTypeValidator(expectedType);
        this.fileSize = new FileSize(expectedSizeInBytes);
        this.file = fileToValidate
    };

    compareOrThrow(_file: File | null = null){
        if (!_file && !this.file){
            throw new Error('[5xx Error] No File is provided to compare with.')
        };
        if (!_file){
            // this means we have to compare the default file
            _file = this.file as File
        };
        // first compare file type & this will automatically throw the error.
        this.fileTypeValidator.validateOrThrow(_file.type);

        // now compare the size
        this.fileSize.compareSizeInMBOrThrow(_file.size);
        return true
        
    }
};

export {FileValidator};