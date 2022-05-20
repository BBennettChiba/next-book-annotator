use std::fs;
fn main() {
    let mut txt_files = Vec::new();
    let files = fs::read_dir("../books/").unwrap();
    for file in files {
        if let Ok(file) = file {
            let file_name = file.file_name();
            if file_name.to_str().unwrap().ends_with(".txt") {
                txt_files.push(file);
            }
        }
    }

    for txt_file in txt_files {
        let path = txt_file.path();
        let text = fs::read_to_string(path);
        let path = format!(
            "../books/{}",
            txt_file.file_name().to_str().unwrap().replace(".txt", "")
        );
        println!("{}", path);
        fs::create_dir(&path).unwrap_or(());

        if let Ok(text) = text {
            let split_by_chapter: Vec<&str> = text.split("\n\n\n\n\n* * *\n\n\n\n\n").collect();
            let mut chapter_count = 1;
            for chapter in split_by_chapter.iter().skip(1) {
                if chapter.len() < 20 {
                    continue;
                }
                let path = format!("{}/{}.txt", path, chapter_count);
                chapter_count += 1;
                fs::write(path, chapter).unwrap_or(());
            }
        }
    }
}
