
import { initializeApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from '@stay-sync/hotel-os';

const firebaseConfig = {
    apiKey: "demo-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "sys-stay-sync", // Use a generic demo project ID or match your .firebaserc
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);

export const dc = getDataConnect(app, connectorConfig);

// Connect to emulator in dev
// Note: You might want to make this conditional on process.env.NODE_ENV
// But for this session we assume emulator usage.
connectDataConnectEmulator(dc, 'localhost', 9399); 
