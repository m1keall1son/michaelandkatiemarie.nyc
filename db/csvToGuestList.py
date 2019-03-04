import csv
import sys

HEAD = """'use strict';

module.exports = {

  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('guests', ["""

TAIL = """\t\t\t], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('guests', null, {});
  }
};"""

DATES = """createdAt: new Date(),
        updatedAt: new Date()"""

def main():
	data = HEAD
	with open(sys.argv[1]) as csv_file:
		csv_reader = csv.reader(csv_file, delimiter=',')
		line_count = 0
		first = True
		for row in csv_reader:
			if line_count == 0:
				columnnames = ", ".join(row)
				print("Column names are {}".format(columnnames))
				line_count += 1
			else:
				print("\tfirst name: {} lastname: {} email: {}.".format(row[1],row[2],row[3]))		
				if first is not True:
					data += ",";
				else:
					first = False
				data += """
				{
					firstname: \"%s\",
					lastname: \"%s\",
					email: \"%s\",
					createdAt: new Date(),
       				updatedAt: new Date(),
       				user_id: null
				}""" % (
					row[1], 
					row[2], 
					row[3]
					)
				line_count += 1
		print("Processed {} lines.".format(line_count))
	data += "\n"
	data += TAIL

	seed = open("seed.js", "w")
	seed.write(data)
	seed.close()

if __name__ == '__main__':
	main()