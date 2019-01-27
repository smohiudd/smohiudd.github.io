---
layout: post
title:  "Social Street Networks"
date:   2018-02-19 00:00:00 -0700
description: "I'm always excited about discovering new ways to visualize how cities are planned and how street networks impact mobility and use. Recently I came across the study of Network Science and Social Network Analysis and its application to Transportation Planning."
---
### I'm always excited about discovering new ways to visualize how cities are planned and how street networks impact mobility and use. Recently I came across the study of Network Science and Social Network Analysis and its application to Transportation Planning.

Basically, Network Science (and Social Network Science), as its name suggest, is a study of networks. At its most rudimentary level a network can be described as a collection of points connected by lines. The study of network science allows us to simplify and analyze complex systems and relational data. I won’t get too deep into the mathematical concepts but the earliest academic work on networks stemmed from graph theory and the work by Euler in relation to the [Seven Bridges of Konigsberg](https://en.wikipedia.org/wiki/Seven_Bridges_of_K%C3%B6nigsberg) bridge problem. In graph theory, a graph can simply be described as a node (point) connected by an edge (line). A graph can either be undirected (the direction of the edge doesn’t matter) or directed (the direction of the edge is important).

The major application of social network science in the past century has mainly been in the social sciences. Foundational work by psychologist Jacob Moreno used social network analysis to gain insights into fields such as sociology, politics, business organization and healthcare.

The network approach to understanding cities using graph theory has been around since the 1960s where much of that research had been centered on urban geography and spatial analysis. Most of the networks in these studies used a simple, intuitive approach in representing the topology of the city where street intersections were nodes and the streets themselves were edges - lets call this the primal graph. To make things more confusing (if they are aren't already), researchers Hiller and Hanson from the Bartlett School at University College London in the 1980s, flipped the previous method on its head. In their representation, the street intersection are the edges and the streets are the nodes. This network is called the dual representation is related to the theory of [Space Syntax](http://www.spacesyntax.com/). The dual graph is a more abstract form and dissociates the network from metric representation and only considers topological space. There is some contention in academic circles about the use of dual versus primal representations - I could write an essay about that but I'll leave that discussion for another day.

The application of network analysis to transportation planning has been a more recent development. Traditional transportation forecasting involves Original-Destination (OD) demand modelling which helps us understand traffic volume and congestion based on O-D pairs (El-Adaway et. al., 2016). Transportation planning and modeling helps cities plan how to best invest resources in new and existing transportation infrastructure.

![panorama](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/social-streets/panorama_graph.png)

Social Network Analysis gives us another perspective on understanding spatial networks of streets and provides transport planners new insights based on a concept called centrality. There are four measures of centrality that help us understand street networks:

**Degree Centrality** - measures the importance of a node by the number of edges the node has. A node with more edges is more important.

**Closeness Centrality** - measures the importance of a node by its geodesic distance to other nodes. The closer a node is to other nodes, the more important the node is.

**Betweeness Centrality** -  measures the importance of a node by its proportion of paths between other nodes. A node that plays the roles of connecting more other nodes is more important (think "bridges").

**Eigenvector Centrality** - assigns relative scores to all nodes in the network based on the principle that connections to high-scoring nodes contribute more to the score of the node in question than equal connections to low-scoring nodes

Now, to map network centrality measures for a street network, OSMnx is an awesome python library created by Geoff Boeing that can help us. I made a simple network graph of a suburb in Calgary. From there we can plot the closeness centrality for both the primal (nodes) and the dual (edges) graphs.

![mckenzie](https://s3-us-west-2.amazonaws.com/smohiudd.github.co/social-streets/mckenzie_nodes_edges.png)

Satellite View (left), Closeness Centrality with nodes (middle), Closeness Centrality edges (right) of McKenzie Towne in Calgary
The areas shown in yellow have higher closeness centralities vs. the purple areas that are lower. Intuitively it makes sense based on the land use, intensity in the yellow shaded areas. In the near future, I'm hoping to relate the closeness centralities to transit planning and comparing bus routes in certain suburban communities.

_Sources:_

1. https://en.wikibooks.org/wiki/Transportation_Geography_and_Network_Science/Centrality
2. El-adaway, Islam H., Ibrahim S. Abotaleb and Eric Vechan. "Social Network Analysis Approach for Improved Transportation Planning." J. Infrastruct. Syst (2017): 23(2).
3. Batty, Michael. "A New Theory of Space Syntax." Centre for Advanced Spatial Analysis, University College London (2004).
4. Porta, Sergio, Paolo Crucitti and Vito Latora. "The network analysis of urban streets: A dual approach." (2005).
