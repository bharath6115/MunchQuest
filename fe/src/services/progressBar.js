// progressBar.js
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false });

// Start progress bar on request
axios.interceptors.request.use((config) => {
    NProgress.start();
    return config;
});

// Stop progress bar on response
axios.interceptors.response.use(
    (response) => {
        NProgress.done();
        return response;
    },
    (error) => {
        NProgress.done();
        return Promise.reject(error);
    }
);