import 'reflect-metadata';
import App from './app';

console.info(`Appointment Service`);

process.on('uncaughtException', (err: any) => {
    console.error(`
    --------------------
    Unhandled Exception:
    ${err}
    --------------------
    `);
});

process.on('unhandledRejection', (err: any) => {
    console.error(`
    --------------------
    Unhandled Rejection:
    ${err}
    --------------------
    `);
});

const app: App = new App();
app.start();
module.exports = app;