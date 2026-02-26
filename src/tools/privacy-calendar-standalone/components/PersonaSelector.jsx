import React from 'react';
import { Users, CheckCircle, ArrowRight } from 'lucide-react';
import { standalonePersonas } from '../data/personas';

const PersonaSelector = ({ onSelect, selectedPersona }) => {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl mb-6">
          <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Privacy Persona
        </h2>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Select the persona that best describes you to get a personalized calendar
        </p>
      </div>

      {/* Persona Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {standalonePersonas.map((persona) => (
          <div
            key={persona.id}
            className={`bg-white dark:bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
              selectedPersona?.id === persona.id 
                ? 'border-purple-500 dark:border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600'
            }`}
            onClick={() => onSelect(persona)}
          >
            <div className="flex flex-col items-center text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-3xl"
                style={{ backgroundColor: `${persona.color}20` }}
              >
                {persona.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {persona.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                {persona.description}
              </p>
              {selectedPersona?.id === persona.id && (
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-600 dark:bg-purple-500 text-white rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Selected</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      {selectedPersona && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-8 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Your calendar will be personalized for the <strong className="text-gray-900 dark:text-white">{selectedPersona.name}</strong> persona
          </p>
          <button 
            onClick={() => onSelect(selectedPersona)}
            className="btn-interactive group px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-orange-600 text-white text-lg font-bold rounded-xl hover:from-red-700 hover:via-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl hover:shadow-red-500/40 min-h-[48px] touch-manipulation"
          >
            <span className="flex items-center justify-center">
              Generate My Calendar
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PersonaSelector;

