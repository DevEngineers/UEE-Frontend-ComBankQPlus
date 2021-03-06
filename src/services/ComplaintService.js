const COMPLAINT_BASE_URI = "http://172.20.10.2:3000/complaints";//172.20.10.2

class ComplaintService {
    /**
     *  This service function is to Add Complaint Details
     */
    async createComplaint(complaint) {
        console.log(complaint);
        return await fetch(COMPLAINT_BASE_URI, {
            method: 'POST',
            headers: {
                'content-Type': 'application/json',
            },
            body: JSON.stringify(complaint),
        })
            .then(response => {
                console.log(response);
                return response;
            })
            .catch(reason => {
                return reason;
            });
    }
    /**
     *  This service function is to Get All Complaint from backend
     */
    async getSignup() {
        return await fetch(COMPLAINT_BASE_URI, {
            method: 'GET',
        })
            .then(response => {
                console.log(response);
                return response.json();
            })
            .catch(reason => {
                return reason;
            });
    }

    /**
     *  This service function is to get one Complaint from backend
     */
    async getSignupByID(id) {
        return await fetch(COMPLAINT_BASE_URI + id, {
            method: 'GET',
        })
            .then(response => {
                return response.json();
            })
            .catch(error => {
                console.log(error.message);
            });
    }

}
export default new ComplaintService();
