const bcrypt = require('bcrypt');

(async () => {
    const plainPassword = 'Admin@123'; // Choose a strong password
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    console.log(hashedPassword);
})();
