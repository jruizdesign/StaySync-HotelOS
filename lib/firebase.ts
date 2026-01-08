
import { initializeApp } from 'firebase/app';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default';

const firebaseConfig = {
    apiKey: "AIzaSyB7DSM9yaCzHPa0gHYhCEKHSZP2ZMAuQUo",
    authDomain: "staysync-hotelos.firebaseapp.com",
    projectId: "staysync-hotelos",
    storageBucket: "staysync-hotelos.firebasestorage.app",
    messagingSenderId: "1090400761794",
    appId: "1:1090400761794:web:4566048d52a1bce4e1c85b",
    measurementId: "G-RXHPX90D56"
};

const app = initializeApp(firebaseConfig);

export const dc = getDataConnect(app, connectorConfig);

import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Connect to emulator in dev
if (window.location.hostname === 'localhost') {
    connectDataConnectEmulator(dc, 'localhost', 9399);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFunctionsEmulator(functions, "localhost", 5001);
    connectStorageEmulator(storage, "localhost", 9199);
} 
