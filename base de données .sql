DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS livre;
DROP TABLE IF EXISTS commande;
DROP TABLE IF EXISTS author;
DROP TABLE IF EXISTS typeDelivre;
DROP TABLE IF EXISTS abonnement;


CREATE TABLE clients (
iduser INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
userFirstName VARCHAR NOT NULL,
dateDeNaissance DATE NOT NULL,
userLastName TINYTEXT NOT NULL,
adresse TINYTEXT(10) NOT NULL,
mail TINYTEXT NOT NULL,
numero VARCHAR NOT NULL,
pseudo VARCHAR NOT NULL UNIQUE,
IDsubmit INT NOT NULL,
datedabonnement  DATE NOT NULL);

CREATE TABLE livre (
idBook INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
title VARCHAR NOT NULL UNIQUE,
idAuthor  INT NOT NULL,
editor VARCHAR NOT NULL,
idBookType  INT NOT NULL);

CREATE TABLE commande (
idCommande INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
iduser INT NOT NULL,
idBook INT NOT NULL,
dateDeReservation DATE NOT NULL UNIQUE);

CREATE TABLE author (
idAuthor INT PRIMARY KEY NOT NULL,
nameAuthor VARCHAR NOT NULL);

CREATE TABLE typeDelivre (
idBookType INT PRIMARY KEY NOT NULL,
type VARCHAR NOT NULL,
genre VARCHAR NOT NULL);

CREATE TABLE abonnement (
IDsubmit INT PRIMARY KEY NOT NULL,
type VARCHAR NOT NULL);

ALTER TABLE clients ADD CONSTRAINT clients_IDsubmit_abonnement_IDsubmit FOREIGN KEY (IDsubmit) REFERENCES abonnement(IDsubmit);
ALTER TABLE livre ADD CONSTRAINT livre_idAuthor _author_idAuthor FOREIGN KEY (idAuthor ) REFERENCES author(idAuthor);
ALTER TABLE livre ADD CONSTRAINT livre_idBookType _typeDelivre_idBookType FOREIGN KEY (idBookType ) REFERENCES typeDelivre(idBookType);
ALTER TABLE commande ADD CONSTRAINT commande_iduser_clients_iduser FOREIGN KEY (iduser) REFERENCES clients(iduser);
ALTER TABLE commande ADD CONSTRAINT commande_idBook_livre_idBook FOREIGN KEY (idBook) REFERENCES livre(idBook);
