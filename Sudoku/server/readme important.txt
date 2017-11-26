################## Procedure à suivre pour run Sudoku su côté server #################

------- package supplementaire à installer ? --------

- npm install reverse-line-reader (n'a pas de typing, suivre la procedure ci-bas pour importer le typing déjà dans le dossier server)
- npm install fs
- npm install ejs
- npm install @types/ejs


############ Autres consideraions ######################

- ajouter reverse-line-reader dans @types, dans nodesmodules
	- copier coller le dossier 'reverse-line-reader' dans nodesmodules/@type (le dossier à copier se trouve dans le dossier du server)
 
- pour se rassurer que le server compile juste une fois,  une ligne a été ajouté dans : package.json 
	"serve": "nodemon out/www.js", dans le script
	-- faire npm run serve pour compiler une fois.

############################
Il faut noter que le server complile parfois 2 fois lorsqu'on fait 'npm start', et cela provoque ce qui suit:

	- on aura au départ 6 derniers événements au lieu de 3 
		(Une discussion a été fait avec un chargé et il a nous a suggeré de rajouter le script mentionné ci-haut) 