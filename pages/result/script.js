         const errorModal = document.getElementById('error-modal');
         const loadingModal = document.getElementById('loading-modal');         
         const resultsContainer = document.getElementById('results-container');
         const spinner = document.getElementById('spinner');

         // Array to hold custom class-subject specific exams
         let customExams = [];
         
              
         // Check if string is a valid UUID format
         function isValidUUID(str) {
             const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
             return uuidRegex.test(str);
         }
         
         // Function to extract token value
         function extractTokenOrReturn(input) {
         try {
         const url = new URL(input);
         const token = url.searchParams.get("token");
         return token !== null ? token : input;
         } catch (error) {
         // Not a valid URL, return the input as is
         return input;
         }
         }
                  
         // Fetch marks from server
         async function getStudentMarks(accessToken) {
         const functionArgs = {
         table1: 'students',
         table2: 'marks',
         match_column1: 'id',
         match_column2: 'student_id',
         columns_table1: ['name', 'class'],
         columns_table2: ['exam', 'subject', 'marks'],
         access_token: accessToken
         };
         
         // Invoke the secure_join
         const studentMarks = await invokeFunction('secure_join_tables', functionArgs, false);
         
         // Process the results
         if (studentMarks) {
         return studentMarks;
         } else {
         console.error('Failed to retrieve student marks');
         return [];
         }
         }
               
         // Fetch student marks using the access token
         function fetchStudentMarks(accessToken) {
         getStudentMarks(accessToken)
         .then(data => {
             hideLoadingModal();
             if (data && data.length > 0) {
                 // Group the flat array by exam before displaying
                 const groupedData = groupByExam(data);
                 displayResults(groupedData);
             } else {
                 showErrorModal("No marks data found for this access token. Please contact your school administration.");
                 
             }
         })
         .catch(error => {
             hideLoadingModal();
             console.error("Error fetching marks:", error);
             showErrorModal("There was a problem fetching your marks. Please try again later.");
             
         });
         }
         
         // Helper function to group marks by exam
         function groupByExam(flatData) {
         const examGroups = {};
         
         flatData.forEach(item => {
         if (!examGroups[item.exam]) {
             examGroups[item.exam] = [];
         }
         examGroups[item.exam].push(item);
         });
         
         // Convert to array of arrays format
         return Object.values(examGroups);
         }
         
         // Display the results in the UI
         async function displayResults(marksData) {
             const examsContainer = document.getElementById('exams-results');
             examsContainer.innerHTML = '';
             
             // Group marks by exam
             const examGroups = {};
             
             marksData.forEach(examGroup => {
                 if (examGroup && examGroup.length > 0) {
                     const examName = examGroup[0].exam;
                     examGroups[examName] = examGroup;
                 }
             });
             
             // Set student info
             if (marksData[0] && marksData[0].length > 0) {
                 const firstRecord = marksData[0][0];
                 document.getElementById('student-name').textContent = firstRecord.name;
                 document.getElementById('student-class').textContent = `Class: ${firstRecord.class}`;
                 // Also store class in a global variable
                 globalClassValue = firstRecord.class;
                 // Pre-load custom exams for this class
                 await preloadCustomExams(globalClassValue);
                 // Also log student visit on server
                 //logActivity(`${firstRecord.name} (${firstRecord.class})`, 'MARKS_VIEW');
             }
             
             // Create exam sections
             for (const examName in examGroups) {
                 const examData = examGroups[examName];

                 // If exam name is not present in common exams (e.g. PT-1), the examSummary has to be kept hidden
                 let hideSummary = false;
                 if (!exams.find(e => e.name === examName)) {
                       hideSummary = true;
                 }
                 
                 
                 // Calculate total marks and percentage for this exam
                 let totalMarks = 0;
                 let totalMaxMarks = 0;
                 
                 examData.forEach(subject => {
                     globalSubjectValue = subject.subject;
                     const maxMarks = getMaxMarks(examName);
                     if (subject.marks !== null) {
                         totalMarks += subject.marks;
                     }
                     totalMaxMarks += maxMarks;
                 });
                 
                 const examPercentage = (totalMarks / totalMaxMarks) * 100;
                 const examRemark = getPerformanceRemark(totalMarks, examName, examPercentage); 
                 
                 // Create exam container
                 const examContainer = document.createElement('div');
                 examContainer.className = 'exam-container';
                 
                 // Create exam header
                 const examHeader = document.createElement('div');
                 examHeader.className = 'exam-heading';
                 examHeader.innerHTML = `<h3 class="exam-title">${examName}:</h3>`;
                 
                 // Create exam summary
                 const examSummary = document.createElement('div');
                 examSummary.className = 'exam-summary';
                 
                 // Total marks summary
                 const totalMarksDiv = document.createElement('div');
                 totalMarksDiv.className = 'summary-item';
                 totalMarksDiv.innerHTML = `
                     <div class="summary-label">Total Marks</div>
                     <div class="summary-value">${totalMarks}/${totalMaxMarks}</div>
                 `;
                 
                 // Percentage summary
                 const percentageDiv = document.createElement('div');
                 percentageDiv.className = 'summary-item';
                 percentageDiv.innerHTML = `
                     <div class="summary-label">Overall Percentage</div>
                     <div class="summary-value">${examPercentage.toFixed(1)}%</div>
                 `;
                 
                 // Remark summary
                 const remarkDiv = document.createElement('div');
                 remarkDiv.className = 'summary-item';
                 remarkDiv.innerHTML = `
                     <div class="summary-label">Overall Performance</div>
                     <div class="summary-remark ${getRemarkClass(examRemark)}">${examRemark}</div>
                 `;
                 
                 examSummary.appendChild(totalMarksDiv);
                 examSummary.appendChild(percentageDiv);
                 examSummary.appendChild(remarkDiv);

                  if(hideSummary) {
                        examSummary.style.display = 'none';
                  }
         
                 // Create table container
                 const tableContainer = document.createElement('div');
                 tableContainer.className = 'table-container';
                 
                 // Create subjects table
                 const table = document.createElement('table');
                 
                 // Table header
                 const tableHead = document.createElement('thead');
                 tableHead.innerHTML = `
                     <tr>
                         <th>Subject</th>
                         <th>Marks</th>
                         <th>Percentage</th>
                         <th>Remark</th>
                     </tr>
                 `;
                 
                 // Table body
                 const tableBody = document.createElement('tbody');
                 
                 // Add subject rows
                 examData.forEach(subject => {
                     const row = document.createElement('tr');
                     globalSubjectValue = subject.subject;
                     const maxMarks = getMaxMarks(examName);
                    
                     // Calculate percentage
                     let percentageText = '-';
                     let remarkHtml = '-';
                     
                     if (subject.marks !== null) {
                         const subjectPercentage = (subject.marks / maxMarks) * 100;
                         percentageText = `${subjectPercentage.toFixed(1)}%`;
                         
                         const remark = getPerformanceRemark(subject.marks, null, subjectPercentage);
                         remarkHtml = `<span class="${getRemarkClass(remark)}">${remark}</span>`;
                     }
                     
                     row.innerHTML = `
                         <td>${subject.subject}</td>
                         <td class="marks-value">${subject.marks !== null ? (subject.marks + '/'+ maxMarks) : 'Absent'}</td>
                         <td class="percent-value">${percentageText}</td>
                         <td>${remarkHtml}</td>
                     `;
                     
                     tableBody.appendChild(row);
                 });
                 
                 table.appendChild(tableHead);
                 table.appendChild(tableBody);
                 tableContainer.appendChild(table);
                 
                 // Add all elements to exam container
                 examContainer.appendChild(examHeader);
                 examContainer.appendChild(examSummary);
                 examContainer.appendChild(tableContainer);
                 
                 // Add exam container to exams results
                 examsContainer.appendChild(examContainer);
             }
             resultsContainer.style.display = 'block';
         }
         
         // Show error modal
         function showErrorModal(message) {
             document.getElementById('error-message').textContent = message || "Invalid QR code. Please try again.";
             errorModal.style.display = 'flex';
         }
         
         // Show loading modal
         function showLoadingModal() {
             loadingModal.style.display = 'flex';
         }
         
         // Hide loading modal
         function hideLoadingModal() {
             loadingModal.style.display = 'none';
         }
         
         // Function to pre-load all custom exams
         async function preloadCustomExams(classVal='') {
         // Pre-load all custom exams
         customExams = await selectData(
                       'custom_exams',
                       fetchSingle = false,
                       columns = "*",
                       matchColumns = ['class'],
                       matchValues = [classVal]
                       ) || [];
         }
         
         async function initializePage(userData) {
         
         // Get the "access_token"
         const accessToken = userData['access_token'];
         
         // Check if token exists and is a valid UUID
         if (accessToken && isValidUUID(accessToken)) {
         showLoadingModal();
         fetchStudentMarks(accessToken);
         }
}
