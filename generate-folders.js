const fs = require('fs');
const path = require('path');

// Đọc dữ liệu
const data = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));
const template = fs.readFileSync('./index.html', 'utf-8');

console.log('🚀 Generating 23 folders for Vercel deployment...\n');

// Tạo folder public nếu chưa có (Vercel sẽ serve từ đây)
const publicDir = './public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate 23 folder
data.forEach((person, index) => {
  // Tạo folder tên từ domain (loại bỏ .vercel.app hoặc domain suffix)
  let folderName = person.name.toLowerCase().replace(/\s+/g, '-');
  
  // Nếu muốn dùng domain làm folder name (recommended)
  // folderName = person.domain.replace(/\./g, '-').replace(/\:/g, '-');
  
  const personDir = path.join(publicDir, folderName);
  
  // Tạo folder
  if (!fs.existsSync(personDir)) {
    fs.mkdirSync(personDir, { recursive: true });
  }

  // Thay thế dữ liệu trong template
  let html = template;
  
  // Thay thế tên
  html = html.replace(
    /<h2 class="guest-name">.*?<\/h2>/,
    `<h2 class="guest-name">${person.name}</h2>`
  );

  // Thay thế chức danh
  html = html.replace(
    /<span class="role-text">.*?<\/span>/,
    `<span class="role-text">${person.title}</span>`
  );

  // Thay thế công ty
  html = html.replace(
    /<span class="company-text">.*?<\/span>/,
    `<span class="company-text">${person.company}</span>`
  );

  // Thay thế page title
  html = html.replace(
    /<title>.*?<\/title>/,
    `<title>Thư Mời YEP 2025 - ${person.name}</title>`
  );

  // Lưu index.html vào folder
  const indexPath = path.join(personDir, 'index.html');
  fs.writeFileSync(indexPath, html, 'utf-8');
  
  console.log(`✅ ${folderName}/index.html → ${person.name} (${person.title})`);
});

console.log(`\n✨ Hoàn thành! Tạo ${data.length} folder trong thư mục: ${publicDir}\n`);

// In hướng dẫn upload
console.log('═'.repeat(70));
console.log('📌 HƯỚNG DẪN UPLOAD LÊN VERCEL:\n');
console.log('1. Commit & push tất cả folder vào Git:');
console.log('   git add public/');
console.log('   git commit -m "Add 23 person folders"');
console.log('   git push\n');
console.log('2. Vercel tự động detect và deploy\n');
console.log('3. Sau đó, access từng người qua:\n');

data.forEach((person, idx) => {
  const folderName = person.name.toLowerCase().replace(/\s+/g, '-');
  console.log(`   ${idx + 1}. https://thanhthai-thiepmoi.vercel.app/${folderName}/`);
});

console.log('\n4. Hoặc custom domain thành:\n');

data.forEach((person, idx) => {
  console.log(`   ${idx + 1}. https://${person.domain}`);
});

console.log('\n═'.repeat(70));
