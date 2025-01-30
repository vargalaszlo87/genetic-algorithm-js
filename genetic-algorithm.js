/*!
 * Genetic Algorithm JS
 *
 * genetic-algorithm.js
 *
 * This application chooses a good item from the crowd. It's a general robust solution.
 *
 * Copyright (C) 2025 Varga Laszlo
 * 
 * https://github.com/vargalaszlo87/genetic-algorithm-js
 * http://vargalaszlo.com
 * http://ha1cx.hu
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of  MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * Date: 2025-01-30
 */


/*!
 *
 * The "config" section can you set your parameters of project.
 * 
 */

const config = {

    // add your categories
    categories: [
        "sunlight",
        "soil", // 
        "terrian",
        "distance",
        "cost"
    ],

    // add the names of categories
    categoriesNames: [
        "Sunlight",
        "Soul quality",
        "Topography quality",
        "Distance from the connection point",
        "Installation cost"
    ],

    // set the range of categories
    ranges: {
        min: 0,
        max: 10
    },

    // "negative impact", where the highest value is worse
    negativeImpact: [
        "distance",
        "cost"
    ],

    // set the deafult weights
    defaultWeights: {
        sunlight: 0.8,
        soil: 0.7,
        terrain: 0.6,
        distance: -0.5,
        cost: -0.7
    },
};

const geneticAlgorithm = {



    // Véletlenszerű helyszín generálása
    generateLocation(id) {
        let location = { id: id };
        config.categories.forEach(category => {
            location[category] = Math.random() * (config.ranges.max - config.ranges.min) + config.ranges.min;
        });
        return location;
    },

    // Véletlenszerű súlyozás generálása a default súlyok körül
    generateWeights() {
        let weights = {};
        config.categories.forEach(category => {
            let baseWeight = config.defaultWeights[category] || 0;
            weights[category] = Math.max(-1, Math.min(1, baseWeight + (Math.random() - 0.5) * 0.2));
        });
        return weights;
    },

    // Fitnesz függvény
    fitness(location, weights) {
        return config.categories.reduce((score, category) => {
            let value = location[category];
            if (config.negativeImpact.includes(category)) {
                value = config.ranges.max - value; // Ha negatív hatású, a kisebb érték a jobb
            }
            return score + value * weights[category];
        }, 0);
    },

    // Populáció generálása
    generatePopulation(size) {
        return Array.from({ length: size }, (_, i) => generateLocation(i + 1));
    },

    // Súlypopuláció generálása
    generateWeightPopulation(size) {
        return Array.from({ length: size }, generateWeights);
    },

    // Szelekció: a legjobb egyedek kiválasztása
    selection(population, weights, eliteCount) {
        return population.sort((a, b) => fitness(b, weights) - fitness(a, weights)).slice(0, eliteCount);
    },

    // Keresztezés: két egyedből új egyed létrehozása
    crossover(parent1, parent2) {
        let child = { id: parent1.id };
        config.categories.forEach(category => {
            child[category] = (parent1[category] + parent2[category]) / 2;
        });
        return child;
    },

    // Mutáció: kis véletlenszerű módosítások
    mutate(location, mutationRate) {
        if (Math.random() < mutationRate) {
            config.categories.forEach(category => {
                location[category] = Math.max(
                    config.ranges.min,
                    Math.min(config.ranges.max, location[category] + (Math.random() - 0.5))
                );
            });
        }
        return location;
    },

    // Fő genetikus algoritmus függvény (elitizmussal, állítható mutációs rátával, korai leállással)
    geneticAlgorithm(generations, populationSize, customWeights = null, eliteRate = 0.1, mutationRate = 0.1, earlyStopThreshold = 0.001, patience = 10) {
        let population = generatePopulation(populationSize);
        let weightPopulation = customWeights ? [customWeights] : generateWeightPopulation(10);
        let eliteCount = Math.max(1, Math.floor(populationSize * eliteRate));
        let bestFitness = -Infinity;
        let noImprovementCount = 0;

        for (let i = 0; i < generations; i++) {
            let selected = selection(population, weightPopulation[0], eliteCount);
            let newPopulation = [...selected];

            while (newPopulation.length < populationSize) {
                let parent1 = selected[Math.floor(Math.random() * selected.length)];
                let parent2 = selected[Math.floor(Math.random() * selected.length)];
                let child = crossover(parent1, parent2);
                newPopulation.push(mutate(child, mutationRate));
            }

            population = newPopulation;
            let currentBestFitness = fitness(selection(population, weightPopulation[0], 1)[0], weightPopulation[0]);

            if (Math.abs(currentBestFitness - bestFitness) < earlyStopThreshold) {
                noImprovementCount++;
                if (noImprovementCount >= patience) {
                    console.log("Early stopping triggered at generation", i);
                    break;
                }
            } else {
                noImprovementCount = 0;
                bestFitness = currentBestFitness;
            }
        }

        return { bestLocation: selection(population, weightPopulation[0], 1)[0], bestWeights: weightPopulation[0] };
    }

}




const mutationRate = 0.05; // Példa mutációs ráta
const result = geneticAlgorithm.geneticAlgorithm(100, 20, null, 0.1, mutationRate, 0.01, 10);
console.log("Legjobb helyszín ID:", result.bestLocation.id);
console.log("Legjobb helyszín adatai:", result.bestLocation);
console.log("Optimalizált súlyok:", result.bestWeights);
console.log("Fitnesz érték:", fitness(result.bestLocation, result.bestWeights));