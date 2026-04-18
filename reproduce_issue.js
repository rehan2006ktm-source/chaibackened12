
import fs from 'fs';
import path from 'path';

const dummyImagePath = path.join(process.cwd(), 'test-image.jpg');
if (!fs.existsSync(dummyImagePath)) {
    fs.writeFileSync(dummyImagePath, 'dummy image content');
}

async function test() {
    const formData = new FormData();
    formData.append('fullname', 'Test User');
    formData.append('email', `testuser_${Date.now()}@example.com`);
    formData.append('username', `testuser_${Date.now()}`);
    formData.append('password', 'password123');

    // For Node's native FormData and fetch, we need a Blob
    const fileBuffer = fs.readFileSync(dummyImagePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    formData.append('avatar', blob, 'avatar.jpg');
    formData.append('coverImage', blob, 'cover.jpg');

    try {
        console.log('Sending registration request...');
        const res = await fetch('http://localhost:8000/api/v1/users/register', {
            method: 'POST',
            body: formData
        });

        // Try to parse JSON, if fails, print text
        const text = await res.text();
        try {
            const data = JSON.parse(text);
            console.log('Status:', res.status);
            console.log('Body:', data);
        } catch (e) {
            console.log('Status:', res.status);
            console.log('Body (text):', text);
        }

    } catch (e) {
        console.error('Error:', e);
        console.error('If connection refused, ensure backend is running via npm run dev in root.');
    }
}

test();
