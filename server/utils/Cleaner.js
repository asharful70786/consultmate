import fs from "fs";
import path from "path";

function clearOldAudio(currentFile) {
  const uploadDir = "./uploads";

  fs.readdir(uploadDir, (err, files) => {
    if (err) return console.error("Error reading upload folder:", err);

    files.forEach(file => {
      if (file !== currentFile) {
        fs.unlink(path.join(uploadDir, file), (err) => {
          if (!err) console.log("Deleted old file:", file);
        });
      }
    });
  });
}

export default clearOldAudio