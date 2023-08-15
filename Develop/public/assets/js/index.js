// Declare variables to store DOM elements
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

// Check if the current page is the "/notes" page and initialize DOM elements
if (window.location.pathname === '/notes') {
  // Select the DOM elements for note title, text, save button, new note button, and note list
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Function to show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Function to hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// Object to store the currently active note
let activeNote = {};

// Function to retrieve notes from the server
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to save a new note to the server
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// Function to delete a note from the server
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Function to render the active note in the editor
const renderActiveNote = () => {
  // Hide the save button
  hide(saveNoteBtn);

  // Check if an active note exists
  if (activeNote.id) {
    // Set note title and text fields as readonly and populate them with active note's data
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    // Make note title and text fields editable and clear their contents
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

// Function to handle saving a note
const handleNoteSave = () => {
  // Create a new note object from title and text fields
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  };
  
  // Save the new note to the server and update UI
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to handle deleting a note
const handleNoteDelete = (e) => {
  // Prevent event propagation to avoid conflicting with other click listeners
  e.stopPropagation();

  // Extract the note element and its ID
  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  // Clear the active note if it's the one being deleted
  if (activeNote.id === noteId) {
    activeNote = {};
  }

  // Delete the note from the server and update UI
  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Function to set the active note and display it in the editor
const handleNoteView = (e) => {
  e.preventDefault();
  // Retrieve the active note from the clicked element's dataset and render it
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Function to handle creating a new note
const handleNewNoteView = (e) => {
  // Clear the active note and render an empty editor
  activeNote = {};
  renderActiveNote();
};

// Function to render the save button based on note content
const handleRenderSaveBtn = () => {
  // Show the save button if either the note title or text has content, otherwise hide it
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Function to render the list of note titles
const renderNoteList = async (notes) => {
  // Fetch JSON notes from the server
  let jsonNotes = await notes.json();

  // Clear the note list if on the "/notes" page
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  // Array to store generated note list items
  let noteListItems = [];

  // Function to create an HTML element for a note item
  const createLi = (text, delBtn = true) => {
    // Create a list item element
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    // Create a span element for note title display and click handling
    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    // Append the span element to the list item
    liEl.append(spanEl);

    // If delete button is enabled, create and append it to the list item
    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);
      liEl.append(delBtnEl);
    }

    return liEl;
  };

  // If no notes exist, add a message to the note list
  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  // Loop through JSON notes and create list items for each
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);
    noteListItems.push(li);
  });

  // If on the "/notes" page, append note list items to the note list container
  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Function to get notes from the server and render them in the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

// Add event listeners for various interactions if on the "/notes" page
if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

// Load existing notes from the server and render them in the sidebar
getAndRenderNotes();
