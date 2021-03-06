﻿using PowerTables.Configuration.Json;

namespace PowerTables.Configuration
{
    /// <summary>
    /// Nongeneric interface for column configurator
    /// </summary>
    public interface IColumnConfigurator
    {
        /// <summary>
        /// JSON Column configuration
        /// </summary>
        ColumnConfiguration ColumnConfiguration { get; }
        
        /// <summary>
        /// Reference to main table configurator
        /// </summary>
        IConfigurator TableConfigurator { get; }
    }
}