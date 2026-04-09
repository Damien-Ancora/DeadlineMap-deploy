import { Button, FeatureCard, StepCard } from "../UI";

const HomePage = () => {
    return (
        <div>
            {/* Hero */}
            <section className="bg-primary text-white py-5" data-bs-theme="dark">
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-md-8">
                            <h1 className="display-4 fw-bold mb-3">
                                Déconnectez-vous du stress.<br />
                                <span className="text-warning">Gérez vos deadlines.</span>
                            </h1>
                            <p className="lead mb-4 fw-light" style={{ maxWidth: '600px' }}>
                                La plateforme exclusive pour les étudiants de l'ICHEC.
                                Centralisez vos échéances personnelles, collaborez en groupe et
                                ne ratez plus jamais une remise grâce à nos vues calendrier et timeline.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                <Button to="/register" variant="warning" size="lg" className="px-4 text-dark fw-bold">
                                    Créer mon compte
                                </Button>
                                <Button to="/login" variant="outline-light" size="lg" className="px-4">
                                    Me connecter
                                </Button>
                            </div>
                            <div className="mt-4 small opacity-75">
                                <i className="bi bi-shield-lock me-2"></i>
                                Accès strictement réservé aux adresses @student.ichec.be
                            </div>
                        </div>
                        <div className="col-md-4 text-center d-none d-md-block">
                            <i className="bi bi-calendar3 display-1 opacity-50 pe-none" style={{ fontSize: '12rem' }}></i>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-5 bg-light">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold mb-3">Une boîte à outils complète</h2>
                        <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>
                            Spécialement conçue pour répondre aux défis d'organisation universitaire, DeadlineMap réunit tout ce dont vous avez besoin.
                        </p>
                    </div>
                    <div className="row g-4 d-flex align-items-stretch">
                        <FeatureCard
                            icon={<i className="bi bi-person-workspace text-primary display-4"></i>}
                            title="Espaces Personnels"
                            description="Ajoutez vos remises, examens et projets. Triez-les par priorité et mettez à jour leur statut d'avancement (en attente, en cours, terminé)."
                        />
                        <FeatureCard
                            icon={<i className="bi bi-people text-success display-4"></i>}
                            title="Travaux de Groupe"
                            description="Créez des espaces collaboratifs. Assignez des deadlines communes et suivez l'évolution du travail de votre équipe de manière synchronisée."
                        />
                        <FeatureCard
                            icon={<i className="bi bi-calendar-range text-warning display-4"></i>}
                            title="Vues Avancées"
                            description="Visualisez vos échéances comme vous le souhaitez : Liste classique, Calendrier mensuel interactif ou via notre Timeline horizontale exhaustive."
                        />
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-5">
                <div className="container py-4">
                    <h2 className="text-center fw-bold mb-5">Comment ça marche ?</h2>
                    <div className="row g-4 text-center">
                        <StepCard
                            step={1}
                            title="Inscription Sécurisée"
                            description="Connectez-vous exclusivement via votre adresse email institutionnelle ICHEC."
                        />
                        <StepCard
                            step={2}
                            title="Centralisation"
                            description="Encodez toutes les dates clés de vos professeurs en début de quadrimestre."
                        />
                        <StepCard
                            step={3}
                            title="Collaboration"
                            description="Rejoignez les groupes de vos cours et partagez le suivi avec vos coéquipiers."
                        />
                        <StepCard
                            step={4}
                            title="Sérénité"
                            description="Consultez le calendrier et recevez vos alertes de rappel pour rendre vos travaux à temps."
                        />
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary text-white py-5 text-center" data-bs-theme="dark">
                <div className="container py-4">
                    <h2 className="fw-bold mb-3">Prêt à mieux organiser votre semestre ?</h2>
                    <p className="lead mb-4 opacity-75">Rejoignez vos camarades sur DeadlineMap dès aujourd'hui.</p>
                    <Button to="/register" variant="warning" size="lg" className="px-5 text-dark fw-bold shadow-sm">
                        <i className="bi bi-rocket-takeoff me-2"></i>Démarrer maintenant
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
