var primaryKeyExists = false;

        function handleFormState() {
            var projectIdVar = $("#projectId").val();
            if (projectIdVar !== "") {
                primaryKeyExists = true;

                $("#updateBtn").prop("disabled", false);
                $("#resetBtn").prop("disabled", false);

                $("#saveBtn").prop("disabled", true);
                $("#projectName").prop("disabled", true);

                fetchDataForProjectId(projectIdVar);
            } else {
                primaryKeyExists = false;

                $("#saveBtn").prop("disabled", false);
                $("#projectName").prop("disabled", false);

                $("#updateBtn").prop("disabled", true);
                $("#resetBtn").prop("disabled", true);
            }
        }

        function fetchDataForProjectId(projectId) {
            // Replace the following URL with the actual URL of your API endpoint
            var apiUrl = "http://api.login2explore.com:5577" + projectId;

            $.get(apiUrl, function (data) {
                // Assuming the response data is in JSON format
                $("#projectName").val(data.projectName);
                $("#assignedTo").val(data.assignedTo);
                $("#assignmentDate").val(data.assignmentDate);
                $("#deadline").val(data.deadline);
            })
            .fail(function () {
                // Handle failure, e.g., display an error message
                console.error("Failed to fetch data for Project ID: " + projectId);
            });
        }

            function validateAndGetFormData() {
                var projectIdVar = $("#projectId").val();
                if (projectIdVar === "") {
                    alert("Project ID is a required value");
                    $("#projectId").focus();
                    return "";
                }

                var projectNameVar = $("#projectName").val();
                if (projectNameVar === "") {
                    alert("Project Name is a required value");
                    $("#projectName").focus();
                    return "";
                }

                var assignedToVar = $("#assignedTo").val();
                if (assignedToVar === "") {
                    alert("Assigned To is a required value");
                    $("#assignedTo").focus();
                    return "";
                }

                var assignmentDateVar = $("#assignmentDate").val();
                if (assignmentDateVar === "") {
                    alert("Assignment Date is a required value");
                    $("#assignmentDate").focus();
                    return "";
                }

                var deadlineVar = $("#deadline").val();
                if (deadlineVar === "") {
                    alert("Deadline is a required value");
                    $("#deadline").focus();
                    return "";
                }

                var jsonStrObj = {
                    projectId: projectIdVar,
                    projectName: projectNameVar,
                    assignedTo: assignedToVar,
                    assignmentDate: assignmentDateVar,
                    deadline: deadlineVar
                };

                return JSON.stringify(jsonStrObj);
            }

            function createPUTRequest(connToken, jsonObj, dbName, relName) {
                var putRequest = "{\n" +
                        "\"token\" : \"" + connToken + "\","
                        + "\"dbName\": \"" + dbName + "\",\n" + "\"cmd\" : \"PUT\",\n"
                        + "\"rel\" : \"" + relName + "\","
                        + "\"jsonStr\": \n" + jsonObj + "\n" + "}";
                return putRequest;
            }

            function executeCommand(reqString, dbBaseUrl, apiEndPointUrl) {
                var url = dbBaseUrl + apiEndPointUrl;
                var jsonObj;

                $.post(url, reqString, function (result) {
                    jsonObj = JSON.parse(result);
                }).fail(function (result) {
                    var dataJsonObj = result.responseText;
                    jsonObj = JSON.parse(dataJsonObj);
                });

                return jsonObj;
            }

            function resetForm() {
                $("#projectId").val("");
                $("#projectName").val("");
                $("#assignedTo").val("");
                $("#assignmentDate").val("");
                $("#deadline").val("");

                // Enable Save button and Project Name field
                $("#saveBtn").prop("disabled", false);
                $("#projectName").prop("disabled", false);

                // Disable Update and Reset buttons
                $("#updateBtn").prop("disabled", true);
                $("#resetBtn").prop("disabled", true);

                // Move cursor to the Project ID field
                $("#projectId").focus();

                // Update global variable to indicate new data entry
                primaryKeyExists = false;
            }

            // Call handleFormState on page load
            $(document).ready(function () {
                handleFormState();
            });

            function saveOrUpdate() {
                var jsonStr = validateAndGetFormData();
                if (jsonStr === "") {
                    return;
                }

                if (primaryKeyExists) {
                    // Update existing record in the database
                    var connToken = "90931850|-31949301058409166|90963060";
                    var dbName = "COLLEGE-DB";
                    var relName = "PROJECT-TABLE";

                    var putReqStr = createPUTRequest(connToken, jsonStr, dbName, relName);
                    alert(putReqStr);

                    jQuery.ajaxSetup({
                        async: false
                    });
                    var resultObj = executeCommand(putReqStr, "http://api.login2explore.com:5577", "/api/iml");
                    alert(JSON.stringify(resultObj));
                    jQuery.ajaxSetup({
                        async: true
                    });

                    alert("Data updated successfully!");
                } else {
                    // Save new record in the database
                    var connToken = "90931850|-31949301058409166|90963060";
                    var dbName = "COLLEGE-DB";
                    var relName = "PROJECT-TABLE";

                    var putReqStr = createPUTRequest(connToken, jsonStr, dbName, relName);
                    alert(putReqStr);

                    jQuery.ajaxSetup({
                        async: false
                    });
                    var resultObj = executeCommand(putReqStr, "http://api.login2explore.com:5577", "/api/iml");
                    alert(JSON.stringify(resultObj));
                    jQuery.ajaxSetup({
                        async: true
                    });

                    alert("Data saved successfully!");
                }

                // Reset the form after save/update
                resetForm();
            }