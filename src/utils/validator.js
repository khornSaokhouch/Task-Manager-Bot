// Validate task input
function validateTaskInput(task) {
    const errors = [];
    if(!task.title || task.title.trim() === '') errors.push('Title is required');
    if(!task.deadline || isNaN(new Date(task.deadline))) errors.push('Valid deadline is required');
    if(task.priority && !['Low','Medium','High'].includes(task.priority)) errors.push('Priority must be Low, Medium, or High');
    return errors;
}

// Validate member input
function validateMemberInput(member) {
    const errors = [];
    if(!member.name || member.name.trim() === '') errors.push('Name is required');
    if(member.role && !['Admin','Member'].includes(member.role)) errors.push('Role must be Admin or Member');
    return errors;
}

module.exports = { validateTaskInput, validateMemberInput };
