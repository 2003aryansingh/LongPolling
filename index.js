const app = require("express")();

const jobs = {};


app.post("/submit", (req,res)=> {       //assigns the jobID to the client 
    const jobID = `job:${Date.now()}`;
    jobs[jobID] = 0;
    updateJob(jobID,0);
    res.end("\n\n" + jobID + "\n\n");
});

app.get("/checkstatus", async (req,res)=> {                     //the endpoint where the client long polls
    console.log(jobs[req.query.jobID]);
    while(await checkJobComplete(req.query.jobID) == false);     //this prohibits the next line of code to run untill the promise resolves with true..
    res.end("\n\nJobStatus: Complete " + jobs[req.query.jobID] + "%\n\n");
});


app.listen(8080, ()=> {
    console.log("Server running 8080");
});


async function checkJobComplete(jobID) {         //async function that returns a promise that resolves to true if job is 100% done or to false when it isn't
    return new Promise((resolve,reject)=> {
        if(jobs[jobID]<100) {
            this.setTimeout(() => {
                resolve(false);
            }, 1000);
        } else {
            resolve(true);
        }    
    })
}


function updateJob(jobID, prg) { //function to fake the job progress using the setTimeout function to update progress by 10% every single time
    jobs[jobID] = prg;
    console.log(`updated ${jobID} to ${prg}`);
    if(prg == 100) return;
    this.setTimeout(() => {
        updateJob(jobID, prg + 10)
    }, 3000);
};