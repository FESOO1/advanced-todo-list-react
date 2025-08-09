import { useState, useEffect } from 'react';

export default function App() {
    return (
        <>
            <TodoList />
        </>
    );
};

function TodoList() {
    const [todoCounter, setTodoCounter] = useState(0);
    const [todos, setTodos] = useState([]);
    const [currentFilter, setCurrentFilter] = useState('ALL');
    const [input, setInput] = useState('');
    const [filterButtons, setFilterButtons] = useState([{ id: 0, text: 'ALL', isActive: true }, { id: 1, text: 'IN PROGRESS', isActive: false }, { id: 2, text: 'DONE', isActive: false }]);

    useEffect(() => {
        const todosLS = JSON.parse(localStorage.getItem('todosLS'));

        // TODOS ARRAY
        if (todosLS) {
            setTodos(todosLS);
        };

        // TODO COUNTER
        const counterLS = localStorage.getItem('counterLS');
        if (counterLS) {
            setTodoCounter(Number(counterLS - 1));
        };
    }, []);

    // HANDLE INPUT
    function handleInput(value) {
        setInput(value);
    };

    // HANDLE FILTER
    function handleFilter(i) {
        if (filterButtons[i].text !== currentFilter) {
            const newButtonsArr = filterButtons.slice('');
            for (const newButton of newButtonsArr) {
                newButton.isActive = false;
            };
            newButtonsArr[i].isActive = true;
            setCurrentFilter(newButtonsArr[i].text);
            setFilterButtons(newButtonsArr);
        };
    };

    // HANDLE CHECKBOX
    function handleCheckbox(index) {
        const todosArr = todos.slice('');
        for (let i = 0; i < todosArr.length; i++) {
            if (todosArr[i].id === index) {
                index = i;
            };
        };
        if (!todosArr[index].isDone) {
            todosArr[index].isDone = true;
        } else {
            todosArr[index].isDone = false;
        };
        setTodos(todosArr);
        localStorage.setItem('todosLS', JSON.stringify(todosArr));
    };

    // HANDLE DELETE
    function handleDelete(index) {
        const todosArr = todos.slice('');

        for (let i = 0; i < todosArr.length; i++) {
            if (todosArr[i].id === index) {
                index = i;
            };
        };

        todosArr.splice(index, 1);
        setTodos(todosArr);
        localStorage.setItem('todosLS', JSON.stringify(todosArr));
    };

    // HANDLE SUBMIT FORM
    function handleSubmitForm(e) {
        e.preventDefault();

        if (input.length > 0) {
            let counter = todoCounter;
            const currentDate = new Date();
            const formatDate = new Intl.DateTimeFormat('en-US', { timeStyle: 'short', dateStyle: 'short' });
            const date = formatDate.format(currentDate);
            const todosArr = todos.slice('');
            todosArr.push(
                {
                    id: counter,
                    isDone: false,
                    value: input,
                    date: date,
                },
            );
            counter++;
            setTodos(todosArr);
            setInput('');
            setTodoCounter(counter++);
            localStorage.setItem('counterLS', counter);
            localStorage.setItem('todosLS', JSON.stringify(todosArr));
        };
    };

    return (
        <main>
            <TodoListHeader />
            <TodoListInputFilter onSubmitTodo={handleSubmitForm} input={input} onChangeInput={handleInput} filterButtons={filterButtons} onClickFilterButtons={handleFilter} />
            <TodoListOutput todos={todos} currentFilter={currentFilter} onChangeCheckbox={handleCheckbox} onClickDelete={handleDelete} />
        </main>
    );
};

// TODO LIST HEADER

function TodoListHeader() {
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        const themeLS = localStorage.getItem('themeLS');

        console.log(themeLS);

        if (themeLS === 'true') {
            document.body.classList.add('light-mode-js');
            setIsLightMode(true);
        };
    }, []);

    function handleToggle() {
        if (!isLightMode) {
            document.body.classList.add('light-mode-js');
            setIsLightMode(true);
            localStorage.setItem('themeLS', true);
        } else {
            document.body.classList.remove('light-mode-js');
            setIsLightMode(false);
            localStorage.setItem('themeLS', false);
        };
    };

    return (
        <div className='main-header'>
            <h3 className='main-header-text'>Fing List</h3>
            <div className='main-header-toggle'>
                <h6 className='main-header-toggle-header'>DARK MODE</h6>
                <button className={isLightMode ? 'main-header-toggle-button main-header-toggle-button-active' : 'main-header-toggle-button'} onClick={handleToggle} type='button'>
                    <div className='main-header-toggle-button-inner'></div>
                </button>
            </div>
        </div>
    );
};

// TODO LIST INPUT FILTER

function TodoListInputFilter({ input, onChangeInput, filterButtons, onClickFilterButtons, onSubmitTodo }) {
    return (
        <div className='main-input-filter'>
            <TodoListInput input={input} onChangeInput={onChangeInput} onSubmitTodo={onSubmitTodo} />
            <TodoListFilter filterButtons={filterButtons} onClickFilterButtons={onClickFilterButtons} />
        </div>
    );
};

function TodoListInput({ input, onChangeInput, onSubmitTodo }) {
    return (
        <form className='main-input'>
            <input type='text' placeholder='Add a todo fing list...' className='main-input-itself' value={input} onChange={(e) => onChangeInput(e.target.value)} />
            <button className='main-input-button' type='submit' onClick={onSubmitTodo}>
                <svg className='main-input-button-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                    <path d="M12 4V20M20 12H4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </form>
    );
};

function TodoListFilter({ filterButtons, onClickFilterButtons }) {
    return (
        <div className='main-filter'>
            {filterButtons.map(filterButton => {
                const text = filterButton.text;
                const classes = filterButton.isActive ? 'main-filter-button main-filter-button-active' : 'main-filter-button';

                return (
                    <button key={text} className={classes} type='button' onClick={() => onClickFilterButtons(filterButton.id)}>{text}</button>
                );
            })}
        </div>
    );
};

function TodoListOutput({ todos, currentFilter, onChangeCheckbox, onClickDelete }) {
    const numberOfElements = todos.map(todo => {
        if (currentFilter === 'IN PROGRESS' && !todo.isDone) {
            return <TodoListOuputItself key={todo.id} todo={todo} onChangeCheckbox={onChangeCheckbox} onClickDelete={onClickDelete} />
        } else if (currentFilter === 'DONE' && todo.isDone) {
            return <TodoListOuputItself key={todo.id} todo={todo} onChangeCheckbox={onChangeCheckbox} onClickDelete={onClickDelete} />
        } else if (currentFilter === 'ALL') {
            return <TodoListOuputItself key={todo.id} todo={todo} onChangeCheckbox={onChangeCheckbox} onClickDelete={onClickDelete} />
        };

        return 0;
    });

    // RETURN AN EMPTY CONTAINER
    if (numberOfElements.length === 0 || todos.length === 0) {
        return <TodoListOutputEmpty />
    };

    // ELSE THE TODOS
    return (
        <div className='main-outputs'>
            {todos.map(todo => {
                if (currentFilter === 'IN PROGRESS' && !todo.isDone) {
                    return <TodoListOuputItself key={todo.id} todo={todo} onChangeCheckbox={onChangeCheckbox} onClickDelete={onClickDelete} />
                } else if (currentFilter === 'DONE' && todo.isDone) {
                    return <TodoListOuputItself key={todo.id} todo={todo} onChangeCheckbox={onChangeCheckbox} onClickDelete={onClickDelete} />
                } else if (currentFilter === 'ALL') {
                    return <TodoListOuputItself key={todo.id} todo={todo} onChangeCheckbox={onChangeCheckbox} onClickDelete={onClickDelete} />
                };
            })}
        </div>
    );
};

function TodoListOutputEmpty() {
    return (
        <div className='main-output-empty'>
            <h4 className='main-output-empty-text'>EMPTY</h4>
            <svg className='main-output-empty-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                <ellipse cx="12" cy="5" rx="8" ry="3" stroke="#ffffff" strokeWidth="1.5"></ellipse>
                <path d="M20 12C20 13.6569 16.4183 15 12 15C7.58172 15 4 13.6569 4 12" stroke="#ffffff" strokeWidth="1.5"></path>
                <path d="M20 5V19C20 20.6569 16.4183 22 12 22C7.58172 22 4 20.6569 4 19V5" stroke="#ffffff" strokeWidth="1.5"></path>
                <path d="M8 8V10" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path>
                <path d="M8 15V17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path>
            </svg>
        </div>
    );
};

function TodoListOuputItself({ todo, onChangeCheckbox, onClickDelete }) {
    const isDone = todo.isDone;
    const classes = isDone ? 'main-output main-output-done' : 'main-output';
    const idText = todo.id + 1;
    const value = todo.value.length > 45 ? todo.value.slice(0, 45) + '...' : todo.value;

    return (
        <div className={classes}>
            <div className='main-output-checkbox'>
                <input type='checkbox' className='main-output-checkbox-input' checked={isDone} onChange={(e) => onChangeCheckbox(todo.id)} />
            </div>
            <button className='main-output-edit-button' type='button'>
                <h5 className='main-output-edit-button-id'>#{idText}</h5>
                <p className='main-output-edit-button-todo-text'>{value}</p>
            </button>
            <button type='button' className='main-output-delete-button' onClick={() => onClickDelete(todo.id)}>
                <svg className='main-output-delete-button-svg' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#ffffff" fill="none">
                    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M9.5 16.5L9.5 10.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path>
                    <path d="M14.5 16.5L14.5 10.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"></path>
                </svg>
            </button>
        </div>
    );
};