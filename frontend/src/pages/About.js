import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Users, Globe, Cpu, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import useLangStore from './store/langStore';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
};

const About = () => {
  const { t } = useLangStore();

  const values = [
    { icon: Zap, title: t('about.valueInnovation'), description: t('about.valueInnovationDesc') },
    { icon: Shield, title: t('about.valueReliability'), description: t('about.valueReliabilityDesc') },
    { icon: Users, title: t('about.valueCommunity'), description: t('about.valueCommunityDesc') },
    { icon: Globe, title: t('about.valueGlobal'), description: t('about.valueGlobalDesc') }
  ];

  const team = [
    { name: 'Dr. Alex Chen', role: 'Founder & CEO', expertise: 'Cybernetic Systems', image: '👨‍💼' },
    { name: 'Sarah Johnson', role: 'CTO', expertise: 'AI & Neural Networks', image: '👩‍💼' },
    { name: 'Marcus Williams', role: 'Head of Product', expertise: 'Hardware Engineering', image: '👨‍💼' },
    { name: 'Elena Rodriguez', role: 'CFO', expertise: 'Strategic Growth', image: '👩‍💼' }
  ];

  const milestones = [
    { year: '2020', event: t('about.milestone2020') },
    { year: '2021', event: t('about.milestone2021') },
    { year: '2022', event: t('about.milestone2022') },
    { year: '2023', event: t('about.milestone2023') },
    { year: '2024', event: t('about.milestone2024') },
    { year: '2025', event: t('about.milestone2025') },
  ];

  return (
    <div className="bg-zinc-950 min-h-screen pt-20">
      {/* Hero Section */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white" initial="hidden" animate="visible" variants={fadeUp}>
            {t('about.title') + ' '}<span className="text-orange-400">{t('about.titleHighlight')}</span>
          </motion.h1>
          <motion.p className="text-lg text-zinc-400 max-w-2xl mx-auto" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
            {t('about.subtitle')}
          </motion.p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="flex items-center mb-6">
              <Target className="h-7 w-7 text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">{t('about.missionTitle')}</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-4">
              {t('about.missionDesc')}
            </p>
            <p className="text-zinc-500">
              {t('about.missionNote')}
            </p>
          </motion.div>

          <motion.div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}>
            <div className="flex items-center mb-6">
              <Cpu className="h-7 w-7 text-orange-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">{t('about.visionTitle')}</h2>
            </div>
            <p className="text-zinc-300 leading-relaxed mb-4">
              {t('about.visionDesc')}
            </p>
            <p className="text-zinc-500">
              {t('about.visionNote')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.h2 className="text-3xl font-bold text-center mb-12 text-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {t('about.valuesTitle') + ' '}<span className="text-orange-400">{t('about.valuesTitleHighlight')}</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                  <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-orange-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2 text-white">{value.title}</h3>
                  <p className="text-zinc-400 text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.h2 className="text-3xl font-bold text-center mb-12 text-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {t('about.journeyTitle') + ' '}<span className="text-orange-400">{t('about.journeyTitleHighlight')}</span>
          </motion.h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div key={index} className="flex gap-6 mb-6" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index * 0.5}>
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-center">
                    <span className="font-bold text-orange-400 text-sm">{milestone.year}</span>
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="absolute top-16 left-1/2 w-px h-6 bg-zinc-800" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-zinc-300 text-sm">{milestone.event}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.h2 className="text-3xl font-bold text-center mb-12 text-white" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            {t('about.leadershipTitle') + ' '}<span className="text-orange-400">{t('about.leadershipTitleHighlight')}</span>
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {team.map((member, index) => (
              <motion.div key={index} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                <div className="text-5xl mb-4">{member.image}</div>
                <h3 className="text-lg font-bold mb-1 text-white">{member.name}</h3>
                <p className="text-orange-400 font-semibold text-sm mb-1">{member.role}</p>
                <p className="text-zinc-500 text-sm">{member.expertise}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { value: '500+', label: t('about.statProducts') },
              { value: '10K+', label: t('about.statUsers') },
              { value: '50+', label: t('about.statCountries') },
              { value: '24/7', label: t('about.statSupport') },
            ].map((stat, index) => (
              <motion.div key={index} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={index}>
                <div className="text-3xl font-bold text-orange-400 mb-2">{stat.value}</div>
                <div className="text-zinc-500 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <motion.div className="max-w-3xl mx-auto text-center bg-zinc-900 border border-zinc-800 rounded-2xl p-10" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl font-bold mb-4 text-white">
              {t('about.ctaTitle') + ' '}<span className="text-orange-400">{t('about.ctaTitleHighlight')}</span>
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              {t('about.ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products" className="bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-xl py-3 px-8 flex items-center justify-center transition-colors">
                {t('about.exploreProducts')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/contact" className="border border-zinc-700 hover:border-orange-500 text-white font-bold rounded-xl py-3 px-8 transition-colors">
                {t('about.getInTouch')}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
