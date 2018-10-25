var passport = require('passport');

var checkRole = function (role, query) {
    return [
        passport.authenticate('jwt', {session: false}),
        function (req, res, next) {
            //Se for admin
            if (req.user.role == 'admin') {
                return next();
            }
            //Validar se ele é ele mesmo
            if (req.user.role == role) {
                if (req.user.dataValues[query] == (req.body[query] || req.params[query])) {
                    //Tudo certo validaremos o role
                    return next();
                } else {
                    return res
                        .status(403)
                        .json({success: false, title: "different.user", message: "different.user", "code": 48});
                        return next();
                }
            } else {
                return res
                    .status(403)
                    .json({success: false, title: "invalid.role", message: "invalid.role", "code": 55});
                    return next();
            }
        }
    ];
};

module.exports = {
    checkRole: checkRole
}
