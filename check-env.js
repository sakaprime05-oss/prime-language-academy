console.log('--- ENV CHECK ---');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'DEFINED (Length: ' + process.env.DATABASE_URL.length + ')' : 'MISSING');
console.log('AUTH_SECRET:', process.env.AUTH_SECRET ? 'DEFINED' : 'MISSING');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? 'DEFINED' : 'MISSING');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('------------------');
