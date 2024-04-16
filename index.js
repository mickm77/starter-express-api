// const bodyParser = require('body-parser');

// const express = require('express');
// const cors = require('cors');

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import serverless from "serverless-http";

const app = express()
app.use(cors());
app.use(bodyParser.json());
const movieCompanyData = [
    {id: 1, name: "True Film Productions"},
    {id: 2, name: "Lazy Lemon Films"},
    {id: 3, name: "Good old TV"}
];
const movieData = [
    {id: 1, title: "A long train ride", filmCompanyId: 1, cost : 1020, releaseYear: 2001},
    {id: 2, title: "Flowers on the meadow", filmCompanyId: 2, cost : 983, releaseYear: 1997},
    {id: 3, title: "Summer", filmCompanyId: 1, cost : 7346, releaseYear: 2015},
    {id: 4, title: "Back to the garden", filmCompanyId: 2, cost : 364, releaseYear: 2009},
    {id: 5, title: "Mr John Smith", filmCompanyId: 3, cost : 26456, releaseYear: 2021}
];

const reviewsData = [
    {id: 1, movieId: 1, score: 6, review: "Great movie"},
    {id: 2, movieId: 1, score: 8, review: "Amazing plot"},
    {id: 3, movieId: 1, score: 7, review: "Good acting"},
    {id: 4, movieId: 1, score: 9, review: "Impressive visuals"},
    {id: 5, movieId: 1, score: 8, review: "Solid performances"},
    {id: 6, movieId: 1, score: 7, review: "Engaging storyline"},
    {id: 7, movieId: 1, score: 8, review: "Well-directed"},
    {id: 8, movieId: 2, score: 5, review: "Decent movie"},
    {id: 9, movieId: 2, score: 7, review: "Interesting concept"},
    {id: 10, movieId: 2, score: 3, review: "Weak execution"},
    {id: 11, movieId: 2, score: 4, review: "Average performances"},
    {id: 12, movieId: 2, score: 5, review: "Beautiful cinematography"},
    {id: 13, movieId: 2, score: 6, review: "Decent plot"},
    {id: 14, movieId: 2, score: 3, review: "Lackluster ending"},
    {id: 15, movieId: 3, score: 1, review: "Terrible movie"},
    {id: 16, movieId: 3, score: 4, review: "Mediocre storyline"},
    {id: 17, movieId: 3, score: 5, review: "Okay acting"},
    {id: 18, movieId: 3, score: 2, review: "Poor direction"},
    {id: 19, movieId: 3, score: 3, review: "Weak character development"},
    {id: 20, movieId: 3, score: 1, review: "Predictable plot"},
    {id: 21, movieId: 3, score: 2, review: "Uninspiring performances"},
    {id: 22, movieId: 4, score: 6, review: "Enjoyable movie"},
    {id: 23, movieId: 4, score: 7, review: "Good cinematography"},
    {id: 24, movieId: 4, score: 4, review: "Lack of depth"},
    {id: 25, movieId: 4, score: 5, review: "Decent performances"},
    {id: 26, movieId: 4, score: 6, review: "Engaging storyline"},
    {id: 27, movieId: 4, score: 7, review: "Well-paced"},
    {id: 28, movieId: 4, score: 3, review: "Weak ending"},
    {id: 29, movieId: 5, score: 2, review: "Disappointing movie"},
    {id: 30, movieId: 5, score: 1, review: "Poorly written"},
    {id: 31, movieId: 5, score: 2, review: "Weak acting"},
    {id: 32, movieId: 5, score: 1, review: "Unoriginal plot"},
    {id: 33, movieId: 5, score: 3, review: "Subpar direction"},
    {id: 34, movieId: 5, score: 2, review: "Lack of depth"},
    {id: 35, movieId: 5, score: 1, review: "Uninspiring performances"}
];

app.use('/movies/:id', (req, res) => {
    res.header({'access-control-allow-origin': '*'});
    const movie = movieData.find(x => x.id === parseInt(req.params.id));
    //add reviews to movie
    movie.reviews = reviewsData.filter(r => r.movieId === movie.id);
    //add the company to the movie
    movie.company = movieCompanyData.find(c => c.id === movie.filmCompanyId);

    movie.averageReview = calculateAverageReview(movie.id);
    if (movie) {
        res.status(200);
        res.send(movie);
    } else {
        res.status(404);
        res.send();
    }
});

const calculateAverageReview = (movieId) => {
    const reviews = reviewsData.filter(r => r.movieId === movieId);
    const totalScore = reviews.reduce((acc, r) => acc + r.score, 0);
    const averageReview = totalScore / reviews.length;
    return averageReview;
}

const movieWithAverageReview = (movie) => {
    const averageReview = calculateAverageReview(movie.id);
    return {
        ...movie,
        averageReview
    };
}

app.get('/movies', (req, res) => {
    res.header({'access-control-allow-origin': '*'});
    if (Math.random() < 0.8) {
        const movies = movieData.map(x => {
            const averageReview = calculateAverageReview(x.id);
            const company = {...movieCompanyData.find(c => c.id === x.filmCompanyId)};
            return {
                ...x,
                averageReview,
                company
            };
        });

        res.status(200);
        res.send(movies);
    } else {
        res.status(500);
        res.send();
    }
});

app.use('/movieCompanies/:id', (req, res) => {
    res.header({'access-control-allow-origin': '*'});
    const company = {...movieCompanyData.find(x => x.id === parseInt(req.params.id))};
    //add movies to company with average review
    company.movies = [...movieData.filter(m => m.filmCompanyId === company.id).map(m => movieWithAverageReview(m))];

    if (company) {
        res.status(200);
        res.send(company);
    } else {
        res.status(404);
        res.send();
    }
});

app.get('/movieCompanies', (req, res) => {
    res.header({'access-control-allow-origin': '*'});
    if (Math.random() < 0.8) { 

        //add movies to company
        const companies = movieCompanyData.map(c => ({
            ...c,
            movies: [...movieData.filter(m => m.filmCompanyId === c.id).map(m => movieWithAverageReview(m))]
        }));

        res.status(200);
        res.send(companies)
    } else {
        res.status(500);
        res.send();
    }
});

app.use('/reviews/:id', (req, res) => {
    res.header({'access-control-allow-origin': '*'});
    const movieId = parseInt(req.params.id);
    const movieReviews = reviewsData.filter(r => r.movieId === movieId);
    if (movieReviews.length > 0) {
        res.status(200);
        res.send(movieReviews);
    } else {
        res.status(404);
        res.send();
    }
});

app.post('/reviews', (req, res) => {

    const movieId = req.body.movieId;
    const score = req.body.score;
    const comment = req.body.review;

    const movie = movieData.find(m => m.id === parseInt(movieId));
    if (!movie) {
        res.status(404);
        res.send({ message: "Movie not found!"});
        return;
    }

    const maxId = Math.max(...reviewsData.map(r => r.id));
    const review = {
        id: maxId + 1,
        movieId: movie.id,
        score: parseInt(score),
        review: comment
    };

    reviewsData.push(review);

    res.header({'access-control-allow-origin': '*'});
    res.header({'content-type': 'application/json'});
    res.status(200);
    res.send({ 
        message: "Thank you for your review!", 
        movie
    });

});

app.listen(process.env.PORT || 3000);
export const handler = serverless(app);
