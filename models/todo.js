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
      const overDueItems = await Todo.overdue();
      console.log(
        overdueitems.map((todo) => todo.displayableString()).join("\n")
      )
      console.log("\n");
      console.log("Due Today");
      const dueTodayItems = await Todo.dueToday();
      console.log(
        dueTodayItems.map((todo) => todo.displayableString()).join("\n")
      )
      console.log("\n");
      console.log("Due Later");
      const dueLaterItems = await Todo.dueLater();
      console.log(
        dueLaterItems.map((todo) => todo.displayableString()).join("\n")
      )
    }

    static async overdue() {
      const overDueTodos = await Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date().toLocaleDateString("en-CA"),
          },
        },
        order: [["id", "ASC"]],
      });
      return overDueTodos
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
      return dueTodayTodos
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
      return dueLaterTodayTodos
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
