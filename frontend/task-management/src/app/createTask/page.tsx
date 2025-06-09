'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import '@/styles/auth.css';

import { useCreateTaskFormStore } from '@/store/createTaskStore';


const CreateTask: React.FC = () => {
    const {
        taskTitle,
        selectedCategory,
        taskDescription,
        dueDate,
        isLoading,
        error,
        setTaskTitle,
        setSelectedCategory,
        setTaskDescription,
        setDueDate,
        submitTask,
        setError,
    } = useCreateTaskFormStore(
        (state) => ({
            taskTitle: state.taskTitle,
            selectedCategory: state.selectedCategory,
            taskDescription: state.taskDescription,
            dueDate: state.dueDate,
            isLoading: state.isLoading,
            error: state.error,
            setTaskTitle: state.setTaskTitle,
            setSelectedCategory: state.setSelectedCategory,
            setTaskDescription: state.setTaskDescription,
            setDueDate: state.setDueDate,
            submitTask: state.submitTask,
            setError: state.setError,
        })
    );

    const categories = [
        { value: 'work', label: 'Work' },
        { value: 'personal', label: 'Personal' },
        { value: 'shopping', label: 'Shopping' },
        { value: 'errands', label: 'Errands' },
        { value: 'project-x', label: 'Project X' },
    ];

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskTitle(e.target.value);
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
         setTaskDescription(e.target.value);
    };

    const handleCategoryChange = (value: string) => {
        setSelectedCategory(value);
    }

     const handleDueDateChange = (date: Date | undefined) => {
        setDueDate(date);
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        submitTask();
    };

    const dueDateButtonClasses = cn(
        "w-full justify-start text-left font-normal",
        !dueDate && "text-muted-foreground"
    );


    return (
        <div className="split-layout-card-section">
            <Card className="w-full max-w-sm split-layout-the-card">
                <CardHeader>
                    <CardTitle>Create New Task</CardTitle>
                    <CardDescription>Enter task details and assign a category</CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="mb-4 text-sm text-red-500 text-center">{error}</div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="task-title">Task Title</Label>
                                <Input
                                    id="task-title"
                                    type="text"
                                    placeholder="e.g., Buy groceries"
                                    required
                                    value={taskTitle}
                                    onChange={handleTitleChange}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="task-category">Category</Label>
                                <Select
                                    value={selectedCategory}
                                    onValueChange={handleCategoryChange}
                                    required
                                >
                                    <SelectTrigger id="task-category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.value} value={category.value}>
                                                {category.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="task-description">Description (Optional)</Label>
                                <Textarea
                                    id="task-description"
                                    placeholder="Add details about the task..."
                                    value={taskDescription}
                                    onChange={handleDescriptionChange}
                                />
                            </div>

                             <div className="grid gap-2">
                                <Label htmlFor="task-due-date">Due Date (Optional)</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={dueDateButtonClasses}
                                            disabled={isLoading}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={dueDate}
                                            onSelect={handleDueDateChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                        </div>
                         <CardFooter className="flex-col gap-2 p-0 pt-6">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create Task'}
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateTask;