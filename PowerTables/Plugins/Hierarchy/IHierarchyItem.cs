﻿namespace PowerTables.Plugins.Hierarchy
{
    /// <summary>
    /// Derive your row ViewModel from this interface to make it hierarchyable
    /// </summary>
    public interface IHierarchyItem
    {
        /// <summary>
        /// Gets or sets flag, mentioning current node contains child nodes
        /// </summary>
        int ChildrenCount { get; set; }

        /// <summary>
        /// Gets or sets node visibility
        /// </summary>
        bool IsVisible { get; set; }

        /// <summary>
        /// Gets or sets whether node is expanded currently or not
        /// </summary>
        bool IsExpanded { get; set; }

        /// <summary>
        /// Gets or sets string key distinguishing this field as parent. 
        /// </summary>
        string RootKey { get; set; }

        /// <summary>
        /// Gets or sets string key distinguishing this field as child
        /// Leave this field null to mark this node as tree root
        /// </summary>
        string ParentKey { get; set; }

        /// <summary>
        /// Readonly field that is being used for internal purposes
        /// </summary>
        string TreeOrder { get; }

        /// <summary>
        /// Gets current node deepness for templating. 
        /// If this field is not specified explicitly - then it will be evaluated by hierarchy plugin
        /// </summary>
        int Deepness { get; }

        /// <summary>
        /// Gets whether node is in loading state loading subchildren
        /// </summary>
        bool IsLoading { get; }
    }
}
