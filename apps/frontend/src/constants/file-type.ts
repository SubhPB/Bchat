
  
export const htmlMimeTypes = [
{
    category: "Images",
    mimeTypes: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp", "image/*"]
},
{
    category: "Audio",
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/aac", "audio/flac", "audio/midi", "audio/*"]
},
{
    category: "Video",
    mimeTypes: ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-matroska", "video/*"]
},
{
    category: "Documents",
    mimeTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain", "application/rtf", "text/*", "appliation/*"]
},
{
    category: "Spreadsheets",
    mimeTypes: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv"]
},
{
    category: "Presentations",
    mimeTypes: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]
},
{
    category: "Archives",
    mimeTypes: ["application/zip", "application/x-rar-compressed", "application/x-7z-compressed", "application/gzip"]
},
{
    category: "Executable",
    mimeTypes: ["application/x-msdownload", "application/x-sh", "application/vnd.android.package-archive"]
},
{
    category: "Code Files",
    mimeTypes: ["text/html", "text/css", "application/javascript", "application/json", "application/xml", "text/yaml", "text/*", "appliaction/*"]
}
] as const;
  