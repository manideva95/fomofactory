
process.on('unhandledRejection', (reason: Error | any) => {
    console.log(`Unhandled Rejection: ${reason.message || reason}`);
    process.exit(1); // It terminates the Node.js application immediately and stops its execution
});

process.on('uncaughtException', (error: Error) => {
    console.log(`Uncaught Exception: ${error.message}`);
    process.exit(1); // It terminates the Node.js application immediately and stops its execution
});