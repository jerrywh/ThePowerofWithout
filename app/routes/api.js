let express = require("express"),
    mongoose = require("mongoose"),
    Settlement = require("../db/models/Settlement"),
    User = require("../db/models/User"),
    crypto = require('crypto');

let router = express.Router();

// Returns a JSON array containing settlement data
router.get("/settlements", function(req, res){
  Settlement.find({}, function(err, docs){
    if(err) throw err;
    res.json(docs);
  });
});

// Add new settlement to database
router.post("/settlements", function(req, res){
  //TODO: add verification to request

  let coords = req.body.geolocation.split(",");

  crypto.randomBytes(24, function(err, buffer) {
    let token = buffer.toString('hex');

    let settlement = new Settlement({
      "name": `${req.body.settlement}, ${req.body.city}`,
      "country": req.body.country,
      "geolocation": {type: 'Point', coordinates: [parseFloat(coords[0]), parseFloat(coords[1])] },
      "email": req.body.email,
    });

    let user = new User({
      "email": req.body.email,
      "contribution": settlement._id,
      "secret": token
    })

    Promise.all([settlement.save(), user.save()])
      .then(function(){
        req.flash('form-redirect', true);
        res.redirect("/contribute/u/" + token);
      })
      .catch(function(err){
        throw err;
      });
  });
});

// Update existing settlement
// router.put("/settlements", function(req, res){
//   //TODO: add verification to request, make user accounts,
//   // let settlement = new Settlement(req.body);
//
//   let coords = req.body.geolocation.split(",");
//
//   let settlement = new Settlement({
//     "name": `${req.body.settlement}, ${req.body.city}`,
//     "country": req.body.country,
//     "geolocation": {type: 'Point', coordinates: [parseFloat(coords[0]), parseFloat(coords[1])] },
//     "email": req.body.email,
//     "site": {
//       "origin": {
//         "causes": req.body.siteOriginCauses,
//         "geolocation": req.body.siteOriginGeolocation, // Continent
//         "population": isNaN(parseInt(req.body.siteOriginPopulation)) ? null : parseInt(req.body.siteOriginPopulation),
//       },
//       "geography": {
//         "topography": req.body.siteGeographyTopography,
//         "withinCities": req.body.siteGeographyWithinCities,
//         "climate": req.body.siteGeographyClimate,
//       },
//       "vulnerability": {
//         "security": {
//           "crimeRate": req.body.siteVulnerabilitySecurityCrimeRate,
//         },
//       }
//     },
//     "architecture": {
//       "physicalNature": {
//         "houseQuality": req.body.architecturePhysicalNatureHouseQuality,
//         "materials": req.body.architecturePhysicalNatureMaterials,
//         "developmentState": req.body.architecturePhysicalNatureMaterials
//       },
//       "infrastructure": {
//         "accessToEnergy": req.body.architectureInfrastructureAccessEnergy,
//         "accessToWater": req.body.architectureInfrastructureAccessWater,
//         "accessToSanitation": req.body.architectureInfrastructureAccessSanitation,
//         "accessToInternetOrPhoneFare": req.body.architectureInfrastructureAccessInternet,
//         "mobilitySystems": req.body.architectureMobility,
//       },
//       "density": {
//         "averageFloors": req.body.architectureDensityElevation,
//         "householdPerHouseSize": req.body.architectureDensityHouseholdPerHouseSize,
//       }
//     },
//     "populace": {
//       "accessToHealthCare": req.body.accessToHealthCare,
//       "accessToEducation": req.body.accessToEducation,
//       "publicAreas": req.body.publicAreas,
//       "ownershipRights": req.body.ownershipRights,
//       "numberHospitals": req.body.numberHospitals,
//       "numberSchools": req.body.numberSchools,
//       "unemploymentRate": req.body.unemploymentRate,
//       "ethnicRacialCategories": req.body.ethnicRacialCategories,
//       "demography": req.body.demography,
//     }
//   });
//
//   settlement.save(function (err) {
//     if(err) throw err;
//     res.send(200);
//   });
// });

module.exports = router;
