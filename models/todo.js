// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      console.log(await Todo.overdue());
      console.log("\n");
      console.log("Due Today");
      console.log(await Todo.dueToday());
      console.log("\n");
      console.log("Due Later");
      console.log(await Todo.dueLater());
    }

    static async overdue() {
      const overDueTodayTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
        },
        order: [["id", "ASC"]],
      });
      return await overDueTodayTodos
        .map((todo) => todo.displayableString())
        .join("\n");
    }

    static async dueToday() {
      const dueTodayTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date().toLocaleDateString("en-CA"),
          },
        },
        order: [["id", "ASC"]],
      });
      return await dueTodayTodos
        .map((todo) => todo.displayableString())
        .join("\n");
    }

    static async dueLater() {
      const dueLaterTodayTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date().toLocaleDateString("en-CA"),
          },
        },
        order: [["id", "ASC"]],
      });
      return await dueLaterTodayTodos
        .map((todo) => todo.displayableString())
        .join("\n");
    }

    static async markAsComplete(id) {
      const todo = await Todo.findByPk(id);
      todo.completed = true;
      await todo.save();
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let date = this.dueDate === new Date().toLocaleDateString("en-CA") ? "" : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${date}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
