var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tasksSchema = new Schema({
	creator: {type: Schema.Types.ObjectId, ref: 'User'},
	taskTitle: String,
	taskDescription: String,
	dateCreated: {type: Date, default: Date.now},
	dueDate: {type: Date}
});

module.exports = mongoose.model('tasks', tasksSchema);