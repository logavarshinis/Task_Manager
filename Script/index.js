const state = {
    taskList: [],
};

const taskContents = document.querySelector(".task__contents");
const taskModal = document.querySelector(".task__modal__body");

const htmlTaskContent = ({ id, title, description, type, url }) =>
    `<div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
        <div class='card shadow-sm task__card'>
            <div class='card-header d-flex gap-2 justify-content-end task__card__header'>
                <button type='button' class='btn btn-outline-info mr-2' name=${id} onclick="editTask.apply(this, arguments)">
                    <i class='fas fa-pencil-alt' name=${id}></i>
                </button>

                <button type='button' class='btn btn-outline-danger mr-2' name=${id} onclick="deleteTask.apply(this, arguments)">
                    <i class='fas fa-trash-alt' name=${id}></i>
                </button>
            </div>
            <div class='card-body'>
                ${url ?
        `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src=${url} alt='card image cap' class='card-image-topmd-3 rounded-lg'/>`
        :
        `<img width='100%' height='150px' style="object-fit: cover; object-position: center" src="https://cdn.dribbble.com/users/1247449/screenshots/3984840/no_img.png" alt='card image cap' class='img-fluid place__holder__image mb-3'/>`
    }
                <h4 class='task__card__title'>${title}</h4>
                <p class='description trim-3-linese text-muted' data-gram_editor='false'>
                    ${description}
                </p>
                <div class='tags text-white d-flex flex-wrap'>
                    <span class='badge bg-primary m-1'>${type}</span>
                </div>
            </div>    
            <div class='card-footer'>
                    <button type='button' class='btn btn-outline-primary float-right' data-bs-toggle='modal' data-bs-target='#ShowTask' id=${id} onclick="openTask.apply(this, arguments)" >Open Task</button>
            </div>
            
        </div>        
    </div>
`;


const htmlModalContent = ({ id, title, description, url }) => {
    const date = new Date(parseInt(id));
    return `
    <div id=${id}>
        ${url ?

            `<img width='100%' height='150px' src=${url} alt='card image cap' class='img-fluid place__holder__image mb-3'/>`
            :
            `<img width='100%' height='150px' src="https://cdn.dribbble.com/users/1247449/screenshots/3984840/no_img.png" alt='card image cap' class='img-fluid place__holder__image mb-3'/>`
        }
        <strong class='text-sm text-muted'> Created on ${date.toDateString()}</strong>
        <h2 class='my-3'>${title}</h2>
        <p class='Leod'>
            ${description}
        </p>
    </div>
    `;
};

const updateLocalStorage = () => {
    localStorage.setItem("tasks", JSON.stringify({
        tasks: state.taskList,
    })
    );
};

const loadInitialData = () => {
    const localStorageCopy = JSON.parse(localStorage.tasks);

    if (localStorageCopy) state.taskList = localStorageCopy.tasks;

    state.taskList.map((cardDate) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardDate));

    });
};

const handleSubmit = (event) => {
    const id = `${Date.now()}`;
    const input = {
        url: document.getElementById('ImageUrl').value,
        title: document.getElementById('TaskTitle').value,
        type: document.getElementById('tags').value,
        description: document.getElementById('TaskDiscription').value,
    };

    if (input.title === '' || input.description === "" || input.type === "") {
        return alert("Please Fill All the Feilds.");
    }
    taskContents.insertAdjacentHTML(
        "beforeend",
        htmlTaskContent({
            ...input,
            id,
        })
    );
    state.taskList.push({ ...input, id });
    updateLocalStorage();

};

const openTask = (e) => {
    if (!e) e = window.event;

    const getTask = state.taskList.find(({ id }) => id === e.target.id);
    taskModal.innerHTML = htmlModalContent(getTask);

};

const deleteTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.getAttribute("name");
    const type = e.target.tagName;
    const removeTask = state.taskList.filter(({ id }) => id !== targetID);
    state.taskList = removeTask;

    updateLocalStorage();
    if (type === "BUTTON") {
        return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
            e.target.parentNode.parentNode.parentNode
        );
    }
    return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
        e.target.parentNode.parentNode.parentNode.parentNode
    );
};

const editTask = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.id;
    const type = e.target.tagName;

    let parentNode;
    let taskTitle;
    let taskDescription;
    let taskType;
    let submitButton;

    if (type === "BUTTON") {
        parentNode = e.target.parentNode.parentNode;

    }
    else {
        parentNode = e.target.parentNode.parentNode.parentNode;

    }

    taskTitle = parentNode.childNodes[3].childNodes[3];
    taskDescription = parentNode.childNodes[3].childNodes[5];
    taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    submitButton = parentNode.childNodes[5].childNodes[1];


    taskTitle.setAttribute("contenteditable", "true");
    taskDescription.setAttribute("contenteditable", "true");
    taskType.setAttribute("contenteditable", "true");

    submitButton.setAttribute('onclick', "SaveEdit.apply(this, arguments)");
    submitButton.removeAttribute('data-bs-toggle');
    submitButton.removeAttribute('data-bs-target');
    submitButton.innerHTML = "Save Changes";

};

const SaveEdit = (e) => {
    if (!e) e = window.event;
    const targetID = e.target.id;
    const parentNode = e.target.parentNode.parentNode;

    const taskTitle = parentNode.childNodes[3].childNodes[3];
    const taskDescription = parentNode.childNodes[3].childNodes[5];
    const taskType = parentNode.childNodes[3].childNodes[7].childNodes[1];
    const submitButton = parentNode.childNodes[5].childNodes[1];

    const UpdateData = {
        taskTitle: taskTitle.innerHTML,
        taskDescription: taskDescription.innerHTML,
        taskType: taskType.innerHTML,
    };

    let stateCopy = state.taskList;

    stateCopy = stateCopy.map((task) => task.id === targetID ? {
        id: task.id,
        title: UpdateData.taskTitle,
        description: UpdateData.taskDescription,
        type: UpdateData.taskType,
        url: task.url,
    }
        : task
    );

    state.taskList = stateCopy;
    updateLocalStorage();

    taskTitle.setAttribute("contenteditable", "false");
    taskDescription.setAttribute("contenteditable", "false");
    taskType.setAttribute("contenteditable", "false");

    submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
    submitButton.setAttribute("data-bs-toggle", "modal");
    submitButton.setAttribute("data-bs-target", "#showTask");
    submitButton.innerHTML = "Open Task";

};

const searchTask = (e) => {
    if (!e) e = window.event;

    while (taskContents.firstChild) {
        taskContents.removeChild(taskContents.firstChild);
    }
    const resultData = state.taskList.filter(({ title }) => {
        return title.toLowerCase().includes(e.target.value.toLowerCase());
    });
    resultData.map((cardData) => {
        taskContents.insertAdjacentHTML("beforeend", htmlTaskContent(cardData));
    });


};