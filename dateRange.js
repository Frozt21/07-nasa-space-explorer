// =====================================
// NASA APOD DATE RANGE CONTROLLER
// =====================================
// Controls:
// - NASA APOD minimum date
// - Maximum date (today)
// - Default 9-day image range
// - Automatic end-date adjustment
// =====================================


// NASA APOD first available image

const earliestDate = "1995-06-16";



// Get today's date

const today = new Date()
    .toISOString()
    .split("T")[0];




// =====================================
// SETUP DATE INPUTS
// =====================================


function setupDateInputs(startInput, endInput){



    // Restrict selectable dates

    startInput.min = earliestDate;

    startInput.max = today;


    endInput.min = earliestDate;

    endInput.max = today;





    // Default range:
    // Last 9 available APOD images


    const defaultStart = new Date();


    defaultStart.setDate(
        defaultStart.getDate() - 8
    );



    startInput.value =
        formatDate(defaultStart);



    endInput.value =
        today;







    // When user changes start date,
    // automatically create an 8-day window


    startInput.addEventListener(
        "change",
        function(){



            if(!startInput.value){

                return;

            }




            const startDate =
            new Date(startInput.value);



            const calculatedEnd =
            new Date(startDate);



            calculatedEnd.setDate(
                calculatedEnd.getDate() + 8
            );






            // Prevent future dates


            if(calculatedEnd > new Date(today)){



                endInput.value =
                today;



            }

            else{



                endInput.value =
                formatDate(calculatedEnd);



            }



        }

    );





    // Prevent end date before start date


    endInput.addEventListener(
        "change",
        function(){



            if(
                new Date(endInput.value)
                <
                new Date(startInput.value)
            ){



                endInput.value =
                startInput.value;



            }



        }

    );



}






// =====================================
// DATE FORMATTER
// =====================================


function formatDate(date){


    return date
        .toISOString()
        .split("T")[0];


}