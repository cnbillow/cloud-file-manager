const store = new Vuex.Store({
    state: {
        path: '/',
        files: []
    },
    getters: {
        pathNameArray(state) {
            if(state.path === '/') {
                return ["Home"];
            }

            let paths = state.path.split('/');
            paths[0] = 'Home'
            return paths;
        }
    },
    mutations: {
        enterDir(state, { dirName }) {
            if(state.path.endsWith('/')) {
                state.path += dirName;
            }
            else {
                state.path += ('/' + dirName);
            }
        },
        enterParentDir(state, { parentDirName, index }) {
            if(state.path !== '/') {
                let path = state.path.toString();
                let nameArr = path.split('/');
                nameArr[0] = "Home";
                parentDirName = parentDirName.toString().replace(/\//g, "");  // remove / in upperDirName
                if(nameArr[index] === parentDirName) {
                    path = nameArr.slice(0, index + 1).join('/');
                    path = (path === "") ? "/" : path;
                    state.path = path;
                }
            }
        },
        changeFiles({ files }, { newFiles }) {
            let length = files.length > newFiles.length ? files.length : newFiles.length;
            newFiles.sort(compareFileName);
            files.splice(0, length, ...newFiles);
        }
    },
    actions: {
        enterDir(context, payload) {
            context.commit("enterDir", payload);
        },
        enterParentDir(context, payload) {
            context.commit("enterParentDir", payload);
        },
        async getCurrentPathContent(context, { path }) {
            let newFiles = await apiGetPathContent(path);
            context.commit("changeFiles", { newFiles });
        }
    }
});

const fileType = ['directory', 'image', 'video', 'audio', 'document', 'zip', 'other'];

function compareString(str1, str2) {
    if(str1 > str2) {
        return 1;
    }
    else if(str1 < str2) {
        return -1;
    }
    else {
        return 0;
    }
}

function compareFileName(f1, f2) {
    if(f1.fileType === 'directory' && f2.fileType !== 'directory') {
        return 1;
    }
    else if(f1.fileType !== 'directory' && f2.fileType === 'directory') {
        return -1;
    }
    else {
        return compareString(f1.fileName, f2.fileName);
    }
}

function compareFileNameWithTime(f1, f2) {
    if(f1.fileType === 'directory' && f2.fileType === 'directory') {
        return compareString(f1.modifiedTime, f2.modifiedTime);
    }
    else if(f1.fileType === 'directory' && f2.fileType !== 'directory') {
        return 1;
    }
    else if(f1.fileType !== 'directory' && f2.fileType === 'directory') {
        return -1;
    }
    else {
        let rv = compareString(f1.modifiedTime, f2.modifiedTime);
        if(rv === 0) {
            return compareString(f1.fileName, f2.fileName);
        }

        return rv;
    }
}

function compareFileNameWithSize(f1, f2) {
    if(f1.fileType === 'directory' && f2.fileType !== 'directory') {
        return 1;
    }
    else if(f1.fileType !== 'directory' && f2.fileType === 'directory') {
        return -1;
    }
    else {
        let rv = compareString(f1.fileSize, f2.fileSize);
        if(rv === 0) {
            return compareString(f1.fileName, f2.fileName);
        }

        return rv;
    }
}
