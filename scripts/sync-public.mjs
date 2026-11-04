// Salin assets/ dan captures/ ke public/ agar bisa dimuat lewat staticFile().
// Sumber kebenaran tetap assets/ dan captures/; public/ boleh dihapus kapan saja.
import {cpSync, mkdirSync, rmSync} from 'node:fs';

rmSync('public', {recursive: true, force: true});
mkdirSync('public', {recursive: true});
cpSync('assets', 'public/assets', {recursive: true});
cpSync('captures', 'public/captures', {recursive: true});
console.log('public/ disinkronkan dari assets/ dan captures/');
