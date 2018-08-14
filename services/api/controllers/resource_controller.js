/**
 *
 * @fileoverview This file implements the logic for the resource endpoints.
 * It is dependent on the resource route module.
 *
 */


"use strict";

const Resources = require('../models/resource_model');

// Deprecated as of 5/22
// exports.getallresources = function(req, res) {
//     let message = "";
//     let status = 200;
//
//     Resources.find({}, (err, resources) => {
//         if(err) {
//             message = `There was an error while retrieving all of the resources.\nError: ${err.name}`;
//             status = 500;
//         } else {
//             message = "Resources retrieved successfully.";
//         }
//         res.status(status).json({
//             success: !!resources,
//             error: err ? err : null,
//             message: message,
//             resources: resources,
//         })
//     });
// };

exports.get_resources_by_customer_id = (req, res) => {
    let message = "";
    let status = 200;
    let id = req.user_id;

    Resources.find({owner: id}, (err, resources) => {
        if(err) {
            message = `There was an error while retrieving all of your resources.\nError: ${err.name}`;
            status = 500;
        } else {
            message = "Resources retrieved successfully.";
        }
        res.status(status).json({
            success: !!resources,
            error: err ? err : null,
            message: message,
            resources: resources,
        });
    });

};

exports.add_resource_by_customer_id = (req, res) => {
    let message, resource;
    let status = 200;
    let id = req.user_id;

    // For some reason this has to be initialized earlier to work.
        resource = new Resources({
        ip_address: req.body.ip_address,
        ram: req.body.ram,
        cores: req.body.cores,
        cpus: req.body.cpus,
        gpus: req.body.gpus,
        status: "Online",
        price: req.body.price,  // TODO: this may need to be determined server side
        owner: id,
        createdBy: id,
        updatedBy: id,
        machine_name: req.body.machine_name
    });

    resource.save((err, new_resource) => {
        if(err) {
            if (err.code === 11000) {
                message = `There was an error while adding the resource.\nError: ${err.name}`;
            } else {
                message = "There was an error while adding the resource.";
            }
            status = 500;
        } else {
            message = "Resource added successfully.";
        }
        res.status(status).json({
            success: !err,
            error: err ? err : null,
            message: message,
            resource: new_resource ? new_resource : null,
        });
    });
};

exports.update_resource_by_customer_id = (req, res) => {
    res.status(501).json({
        success: true,
        error: null,
        message: "NOT IMPLEMENTED",
    });
};

exports.delete_resource_by_id = (req, res) => {
    let message;
    let status = 200;
    let id = req.user_id;

    Resources.remove({
        owner: id,
        _id: req.params.resource_id,
    }, (err) => {
        if(err) {
            message = `There was an error while deleting the resource: ${req.body.resource_id}.\nError: ${err.name}`;
            status = 500;
        } else {
            message = "Resource deleted successfully";
        }

        // Housekeeping
        if(req.body.resource_id) {
            message += "\nNOTICE: This endpoint is being deprecated. Please pass 'resource_id' as the endpoint."
        }

        res.status(status).json({
            success: !err,
            error: err ? err : null,
            message: message,
        })
    });
};