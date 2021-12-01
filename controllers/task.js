const { Users, Task } = require("../models");
require("dotenv").config();
const Joi = require('joi');
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");

module.exports = {
    sendTask: async (req, res) => {
        const body = req.body;
        const userId = req.users.id
        try {
            const schema = Joi.object({
                userId: Joi.number(),
                email: Joi.string().email().required(),
                task: Joi.string(), required()
            }),

            const check = schema.validate({
                userId: userId,
                email: body.email,
                task: body.task
            })

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: check.error["details"][0]["message"]
                })
            }

            const user = await Users.findOne({
                where: {
                    email: body.email,
                },
            });
            if (!user) {
                return res.status(400).json({
                    status: "failed",
                    message: "This email does not exist.",
                    data: null,
                });
            }

            const task = await Task.create({
                userId: userId,
                email: body.email,
                task: body.task
            });

            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: "tesfadhlan@gmail.com",
                    pass: "secret123!@#",
                },
            });
            const handlebarOptions = {
                viewEngine: {
                    partialsDir: path.resolve("./views/"),
                    defaultLayout: false,
                },
                viewPath: path.resolve("./views/"),
            };
            transporter.use("compile", hbs(handlebarOptions));
            let mailOptions = {
                from: `tesfadhlan@gmail.com`,
                to: `${user.email}`,
                subject: "[Kas-E] Your Forgotton Password",
                template: "task",
                context: {
                    task: `${task.task}`,
                },
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return error;
                }
            });
            return res.status(200).json({
                msg: "Sent task successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
                data: null,
            });
        }
    },

    getOneTask: async (req, res) => {
        const id = req.params.id
        try {
            const oneTask = await Task.findOne({ where: { id } });

            if (!oneTask) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found"
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Succesfully Retrieved Task",
                data: oneTask
            });

        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error"
            })
        }
    },

    getAllTask: async (req, res) => {
        try {
            const dataTask = await Task.findAll({
            });

            if (!dataTask) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Data not found"
                });
            }

            return res.status(200).json({
                status: "success",
                message: "Succesfully Retrieved All Task",
                data: dataTask,
            });

        } catch (error) {
            return res.status(500).json({
                status: "Failed",
                message: "Internal Server Error"
            })
        }
    },

    updateTask: async (req, res) => {
        const body = req.body
        const id = req.params.id
        const userId = req.users.id
        try {
            const schema = Joi.object({
                userId: Joi.number(),
                email: Joi.string().email().required(),
                task: Joi.string(), required()
            })

            const check = schema.validate({
                userId: userId,
                email: body.email,
                task: body.task
            })

            if (check.error) {
                return res.status(400).json({
                    status: "failed",
                    message: "Bad Request",
                    errors: check.error["details"][0]["message"]
                })
            }

            const checkrole = await Users.findOne({
                where: { id }
            })

            if (checkrole.dataValues.role == "admin") {
                return res.status(400).json({
                    status: "failed",
                    message: "Cannot update Data Admin"
                })
            }

            if (body.email) {
                const checkemail = await Users.findOne({ where: { email: body.email } })
                if (checkemail) {
                    return res.status(400).json({
                        status: "fail",
                        message: "email already used before, please use another email",
                    });
                }
            }

            if (body.password) {
                const oldPass = await Users.findOne({
                    where: {
                        userId
                    },
                });

                const checkPassword = checkPass(
                    body.password,
                    oldPass.dataValues.password
                );

                if (checkPassword) {
                    return res.status(400).json({
                        status: "fail",
                        message: "Password already used before, please use new password",
                        data: null
                    });
                }

                const hashedPassword = encrypt(body.password);

                await Users.update(
                    { password: hashedPassword },
                    { where: { id: user.id } }
                );
            }

            const userUpdate = await Users.update(
                {
                    email: body.email,
                },
                {
                    where: { userId },
                }
            );
            if (!userUpdate) {
                return res.status(400).json({
                    status: "failed",
                    message: "Unable to input data",
                });
            }

            const TaskUpdate = await Task.update(
                {
                    userId: userId,
                    email: body.email,
                    task: body.task
                },
                {
                    where: {
                        userId = userId
                    }
                }
            );

            if (!TaskUpdate[0]) {
                return res.status(400).json({
                    status: "failed",
                    message: "Unable to input data"
                });
            }

            const data = await Task.findAll({
                where: {
                    userId
                }
            })

            return res.status(200).json({
                status: "success",
                message: "Succesfully update the Task",
                data: data
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
                data: null
            })
        }
    },

    deleteTask: async (req, res) => {
        const id = req.params.id;
        try {
            const taskUser = await Task.destroy({ where: { id } });
            if (!taskUser) {
                return res.status(400).json({
                    status: "failed",
                    message: "Data not found",
                    data: null
                });
            }
            return res.status(200).json({
                status: "success",
                message: "Deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                status: "failed",
                message: "Internal Server Error",
                data: null
            });
        }
    },

}