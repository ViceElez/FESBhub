import axios from "axios";

const route = "http://localhost:3000";

export async function addSubjectComment(subjectId: number, ratingPract: number, ratingDiff: number, ratingExpect: number, content: string, token?: string | null, userId?: string | undefined) {
    try {
        return axios.post(`${route}/comment-subj`, {
            "userId": parseInt(userId!!),
            "subjectId": subjectId,
            "ratingDifficulty": ratingDiff,
            "ratingPracticality": ratingPract,
            "ratingExpectation": ratingExpect,
            "content": content
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
};

export async function deleteSubjectComment(subjectId: number, token?: string | null, userId?: number) {
    try {
        return axios.delete(`${route}/comment-subj/`, {
            data: {
                "userId": userId,
                "subjectId": subjectId
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
};

export async function editSubjectComments(subjectId: number, ratingPract: number, ratingDiff: number, ratingExpect: number, content: string, token?: string | null, userId?: string | undefined) {
    try {
        return axios.patch(`${route}/comment-subj/`,
            {
                "userId": userId,
                "subjectId": subjectId,
                "newRatingPracticality": ratingPract,
                "newRatingDifficulty": ratingDiff,
                "newRatingExpectation": ratingExpect,
                "newContent": content,
                "oldRatingPracticality": 0,
                "oldRatingDifficulty": 0,
                "oldRatingExpectation": 0,
                "oldContent": ""
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    } catch (e) {
        console.log(e)
        return
    }
};

export async function getSubjectComments(subjectId: number, token?: string | null, userId?: string | undefined) {
    try {
        return axios.get(`${route}/comment-subj/exists?subjectId=${subjectId}&userId=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
};

export async function getUnverifiedSubjectComments(token?: string | null) {
    try {
        return axios.get(`${route}/comment-subj/all`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
};

export async function verifySubjectComment(subjectId: number, userId: number | undefined, ratingPracticality: number, ratingDiff: number, ratingExpect: number, content: string, token?: string | null) {
    try {
        return axios.patch(`${route}/comment-subj/verify`, {
            "userId": userId,
            "subjectId": subjectId,
            "ratingPracticality": ratingPracticality,
            "ratingDifficulty": ratingDiff,
            "ratingExpectation": ratingExpect,
            "content": content,

        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
};

export async function getVerifiedSubjectComments(subjectId: number, token?: string | null) {
    try {
        return axios.get(`${route}/comment-subj/verified?subjectId=${subjectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
};

export async function getSubjectCommentsByUserId(userId: number, token?: string | null) {
    try {
        return axios.get(`${route}/comment-subj/user/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        alert('Failed to fetch subject comments.');
        return
    }
};

export async function getAllCommentsBySubjectId(subjectId: number, token?: string | null) {
    try {
        return axios.get(`${route}/comment-subj/subj/${subjectId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
}

export async function getSubjectCommentBySubjectAndUserId(subjectId: number,userId?:string | null, token?: string | null) {
    try {
        return axios.get(`${route}/comment-subj/${subjectId}/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        console.log(e)
        return
    }
}