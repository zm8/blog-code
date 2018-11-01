#!/bin/bash

get_branch=`git symbolic-ref --short -q HEAD`
echo  git branch is $get_branch