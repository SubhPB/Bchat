// Byimaan
/**
GOALS of this code :-
This code defines a set of classes to validate file types and sizes in a application. 
- **Type Class**: Compares the primary type of a file (e.g., 'image', 'video').
- **Format Class**: Compares the file format or subtype (e.g., 'jpeg', 'mp4').
- **FileTypeValidator Class**: Validates a file's type and format against expected values and throws errors if they don't match.
- **FileSize Class**: Validates a file's size, comparing it to an expected maximum size.
- **FileValidator Class**: Combines the functionality of the FileTypeValidator and FileSize classes to validate both the type and size of a file, throwing errors if validations fail.
These classes provide a robust way to enforce file type and size constraints, ensuring that only valid files are processed further in the application.
*/

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
            throw new Error(`The file was expected to be of type ${this.type.type} and not of ${fileType.split('/')[0]}.`)
        };

        if (!this.format.compare(fileType)){
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