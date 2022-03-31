import os

""" PROBLEM SET INFORMATION """

# name of all the mini-games
all_games = [
	'EnterIfYouDare', 'CaptureGhost', 'ThirstyVampire', 'NightOfTheZombies', 
	'WesternShooter', 'OKCorral', 'LassoBronco', 
	'RocketScience', 'SpaceRaider', 'AlienEscape', 
	'JungleZipline', 'AncientTemple', 'PhotographLion', 
	'CastleAttack', 'KnightsOath', 'Joust', 
	'Football', 'Goal', 
	'BalloonPop', 'FerrisWheel', 'WhacAGopher', 
	'WalkThePlank', 'PegLegShop', 'FireTheCannon'
]

# 10 instances of each mini-game
all_games = [[game + str(i) for i in range(1, 11)] for game in all_games]
all_games = sum(all_games, [])

# name of all the problems (survey + animation + mini-games)
pre_items = ["DemographicQuestionnaire", "GameSurvey", "DecimalPointMarquee", "Map"]
post_items = ["Ending", "PostSurveyHA", "EvaluationQuestionnaire", "EvaluationQuestionnaire2"]
all_problems = pre_items + all_games + post_items

skill_names = ["Number_Line", "Sorting", "Bucket", "Sequence", "Addition"]
bkt_values = {"pKnown" : 0.4, "pLearn" : 0.05, "pGuess" : 0.299, "pSlip" : 0.299}


""" XML CONSTRUCTION """

# template XML string for one CTAT problem
problem_template = '\t\t<Problem name="{problem_name}" label="{problem_name}" description="{problem_name}" tutor_flag="tutor" problem_file="{brd}" selection_features="()" student_interface="{html}">\n\
\t\t\t<Skills>\n\
\t\t\t</Skills>\n\
\t\t</Problem>\n'

# name of all the .brd and .html files
brd_mapping = {game : 'PS{}.brd'.format(game) for game in all_games}
html_mapping = {game : '{}.html'.format(game[:-2] if '10' in game else game[:-1]) for game in all_games}

# the final xml string
xml_output = '<Package name="DecimalPoint2019_Learning" label="Decimal Point 2019 Learning-Oriented Condition" description="Decimal Point 2019 Learning-Oriented Condition" tutor_type="javascript">\n'

# list all the problems
problems = '\t<Problems>\n'
for p in all_problems:
	problems += problem_template.format(problem_name = p, brd = brd_mapping.setdefault(p, p + '.brd'), html = html_mapping.setdefault(p, p + '.html'))
problems += '\t</Problems>\n'
xml_output += problems

# the problemset, we expect only one problem set per package
problemset = '\t<ProblemSets>\n'
problemset += '\t\t<ProblemSet name="{ps}" label="{ps_label}" description="{ps_label}" status="Active" team_size="1" selection_algorithm="sequential" max_count="1000" max_repeat="1" initial_sequence="0">\n'.format(
		ps = "2019-2020 Decimal Point Study - Game, Learning Condition",
		ps_label = "2019-2020 Decimal Point Study - Game, L"
	)
problemset += '\t\t\t<Problems>\n'

# append all the problems
for index, problem in enumerate(all_problems):
	problemset += '\t\t\t\t<Problem name="{}" position="{}" role="0"/>\n'.format(problem, index + 1)
problemset += '\t\t\t</Problems>\n'

# list all the skills and their BKT values
problemset += '\t\t\t<Skills>\n'
for index, skill in enumerate(skill_names):
	problemset += '\
	\t\t\t\t<Skill name="{skill}" label="{skill}" description="{skill}" category="{skill}" \
	position="{pos}" pKnown="{pKnown}" pLearn="{pLearn}" pGuess="{pGuess}" pSlip="{pSlip}"/>\n'.format(
		skill = skill, pos = index, pKnown = bkt_values["pKnown"], pLearn = bkt_values["pLearn"],
		pGuess = bkt_values["pGuess"], pSlip = bkt_values["pSlip"]
	)
problemset += '\t\t\t</Skills>\n'

problemset += '\
\t\t\t<Assets></Assets>\n\
\t\t\t<Categories>\n\
\t\t\t\t<Standard name="Student" label="Problem Set Categories" description="Student Standards" category="standard"/>\n\
\t\t\t\t<Standard name="CommonCore" label="Common Core Standards" description="Common Core Standards" category="standard"/>\n\
\t\t\t\t<Standard name="NCTM" label="NCTM Curriculum Focal Points" description="NCTM Curriculum Focal Points" category="standard"/>\n\
\t\t\t\t<Standard name="PA" label="PA Assessment Anchors" description="PA Assessment Anchors" category="standard"/>\n\
\t\t\t\t<Collection name="general" label="Released Problem Sets" description="Released Problem Sets"/>\n\
\t\t\t</Categories>\n'
problemset += '\t\t</ProblemSet>\n'
problemset += '\t</ProblemSets>\n'
xml_output += problemset

## list all the assets
assets = '\t<Assets>\n'
for root, directories, files in os.walk("HTML/"):
	for file in files:
		assets += '\t\t<Asset name="{location}" label="{name}" description="{name}" asset_locator="{location}"/>\n'.format(name = file, location = os.path.join(root, file))

for root, directories, files in os.walk("FinalBRDs/"):
	for file in files:
		assets += '\t\t<Asset name="{location}" label="{name}" description="{name}" asset_locator="{location}"/>\n'.format(name = file, location = os.path.join(root, file))
assets += '\t</Assets>\n'
xml_output += assets

xml_output += '</Package>'

with open('package.xml', "w") as f:
	f.write(xml_output)



